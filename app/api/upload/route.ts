import { NextRequest, NextResponse } from 'next/server';

const IMGBB_KEY = process.env.IMGBB_API_KEY ?? '4ec5df48b42fa6229129ecb566f4de6d';
const IMGBB_URL = 'https://api.imgbb.com/1/upload';

// Catbox.moe — free, permanent, no key needed, supports any file up to 200 MB
// POST https://catbox.moe/user.php  multipart: reqtype=fileupload, fileToUpload=<file>
// Returns plain-text URL: https://files.catbox.moe/xxxxxx.ext
const CATBOX_URL = 'https://catbox.moe/user.php';

/** Image MIME types routed to ImgBB */
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/jpg'];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isImage = IMAGE_MIMES.includes(file.type.toLowerCase());

    if (isImage) {
      /* ── ImgBB path for images ── */
      const imgForm = new FormData();
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      imgForm.append('image', base64);
      imgForm.append('name', file.name);

      const res = await fetch(`${IMGBB_URL}?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: imgForm,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[upload] ImgBB error:', errText);
        // Fallback to catbox for images too if ImgBB fails
        return uploadToCatbox(file);
      }

      const json = await res.json();
      const url: string = json?.data?.url ?? json?.data?.display_url;
      if (!url) {
        return uploadToCatbox(file);
      }
      return NextResponse.json({ url, provider: 'imgbb', type: 'image' });

    } else {
      /* ── Catbox.moe path for video / audio / PDF / any other ── */
      return uploadToCatbox(file);
    }
  } catch (err) {
    console.error('[upload] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function uploadToCatbox(file: File): Promise<NextResponse> {
  try {
    const catboxForm = new FormData();
    catboxForm.append('reqtype', 'fileupload');
    catboxForm.append('fileToUpload', file, file.name);

    const res = await fetch(CATBOX_URL, {
      method: 'POST',
      body: catboxForm,
    });

    const text = await res.text();

    if (!res.ok || !text.startsWith('https://')) {
      console.error('[upload] Catbox error:', text);
      return NextResponse.json({ error: 'Upload failed', detail: text.slice(0, 200) }, { status: 502 });
    }

    const url = text.trim();
    const mimeTop = file.type.split('/')[0]; // image | video | audio | application
    const type = mimeTop === 'image' ? 'image'
               : mimeTop === 'video' ? 'video'
               : mimeTop === 'audio' ? 'audio'
               : 'document';

    return NextResponse.json({ url, provider: 'catbox', type });
  } catch (err) {
    console.error('[upload] Catbox exception:', err);
    return NextResponse.json({ error: 'Upload service unavailable' }, { status: 502 });
  }
}
