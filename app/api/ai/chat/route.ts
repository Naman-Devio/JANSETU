import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastUserMessage = (messages[messages.length - 1]?.content || '').trim();

    const geminiKey = process.env.GEMINI_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    const systemPrompt = `You are "JanSetu AI Mitra", a friendly, empathetic, and intelligent civic voice assistant for JanSetu (Jharkhand's civic innovation platform, SIH 2026).

YOUR ROLE: YOU ARE A CONTINUOUS LIVE COPILOT:
You stay on the live voice call with the citizen until they successfully submit their report!
1. NATURAL, WARM & CONCISE (1-2 SENTENCES MAX):
   - Speak conversationally like a helpful human friend standing right beside the user. Keep voice replies short (1-2 sentences) so voice synthesis is snappy.
   - Match the user's language (Hindi, Hinglish, or English).
2. REPORT GENERATION & ENRICHMENT:
   - When the user first mentions any civic problem, immediately generate a structured "reportDraft" object with title, domain, district, block, priority, and description.
   - If a report already exists and the user adds more information ("yaha 5 din se paani band hai", "pul tut gaya hai"), update and enrich the reportDraft description with the new details.
3. ON-SCREEN INTERACTIVE TROUBLESHOOTING & GUIDANCE:
   - If the user asks how to attach photos/videos ("photo kaise lagaye", "video daalna hai"):
     Guide them: "स्क्रीन पर बैंगनी रंग का 'Attach Photo or Video' बटन है, उस पर क्लिक करके आप तुरंत फ़ोटो या वीडियो अपलोड कर सकते हैं।"
   - If the user asks about location ("location kaise detect kare", "mera pata nahi aa raha"):
     Guide them: "स्क्रीन पर 'Detect My Current GPS Location' बटन दबाएं, आपका सही स्थान अपने आप मैप हो जाएगा।"
   - If the user asks how to submit or what to do next:
     Guide them: "नीचे दिए गए चेकबॉक्स 'I grant permission' पर टिक करके 'Submit Verified Report' बटन दबा दीजिए, आपकी रिपोर्ट तुरंत दर्ज हो जाएगी।"
   - If it's a general greeting or thank you, respond warmly and ask if they need any more help before submitting.

OUTPUT FORMAT MUST BE VALID JSON ONLY:
{
  "reply": "Short, warm, 1-2 sentence human-like conversational answer",
  "reportDraft": null OR {
    "title": "Clear concise civic title",
    "domain": "Infrastructure & Roads OR Water & Sanitation OR Energy & Power OR Agriculture & Environment OR Public Health",
    "district": "Extracted district or Ranchi",
    "block": "Extracted block or Namkum Block",
    "priority": "HIGH or MEDIUM or LOW",
    "description": "Problem summary enriched with any new details from user",
    "suggestedCapabilities": ["Capability 1", "Capability 2"]
  }
}`;

    let replyText = '';
    let reportDraft = null;

    // Helper for resilient JSON extraction
    const parseCleanJson = (rawStr: string) => {
      let cleaned = rawStr.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }

      try {
        return JSON.parse(cleaned);
      } catch {
        // Fallback regex extraction if JSON was slightly truncated or had raw newlines
        const replyMatch = cleaned.match(/"reply"\s*:\s*"([\s\S]*?)"/);
        const reply = replyMatch ? replyMatch[1].replace(/\\n/g, ' ') : '';

        const titleMatch = cleaned.match(/"title"\s*:\s*"([\s\S]*?)"/);
        const descMatch = cleaned.match(/"description"\s*:\s*"([\s\S]*?)"/);

        let draft = null;
        if (titleMatch) {
          draft = {
            title: titleMatch[1],
            domain: 'Infrastructure & Roads',
            district: 'Ranchi',
            block: 'Namkum Block',
            priority: 'HIGH',
            description: descMatch ? descMatch[1] : 'Civic issue reported by citizen.',
            suggestedCapabilities: ['Civic Engineering', 'Road Construction'],
          };
        }
        return { reply, reportDraft: draft };
      }
    };

    // 1. Try Gemini 3.6 Flash
    if (geminiKey) {
      try {
        const contents = [
          { parts: [{ text: systemPrompt }] },
          ...messages.map((m: ChatMessage) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        ];

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2,
                maxOutputTokens: 2048,
              },
            }),
            signal: AbortSignal.timeout(10000),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = parseCleanJson(raw);
            replyText = parsed.reply || '';
            reportDraft = parsed.reportDraft || null;
          }
        }
      } catch (err) {
        console.warn('Gemini chat API exception:', err);
      }
    }

    // 2. OpenRouter fallback models if Gemini fails
    if (!replyText && openrouterKey) {
      try {
        const models = [
          'meta-llama/llama-3.3-70b-instruct',
          'google/gemini-2.5-flash',
        ];

        for (const model of models) {
          const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${openrouterKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://jansetu.gov.in',
              'X-Title': 'JanSetu AI Voice Mitra',
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: ChatMessage) => ({
                  role: m.role === 'assistant' ? 'assistant' : 'user',
                  content: m.content,
                })),
              ],
            }),
            signal: AbortSignal.timeout(10000),
          });

          if (openrouterRes.ok) {
            const data = await openrouterRes.json();
            const raw = data.choices?.[0]?.message?.content;
            if (raw) {
              const parsed = parseCleanJson(raw);
              replyText = parsed.reply || '';
              reportDraft = parsed.reportDraft || null;
              if (replyText) break;
            }
          }
        }
      } catch (err) {
        console.warn('OpenRouter fallback error:', err);
      }
    }

    // 3. Dynamic Smart Fallback with Guided Assistance
    if (!replyText) {
      const lower = lastUserMessage.toLowerCase();
      if (lower.includes('photo') || lower.includes('media') || lower.includes('camera') || lower.includes('video') || lower.includes('tasveer')) {
        replyText =
          'स्क्रीन पर बैंगनी रंग का "Attach Photo or Video" बटन है, उस पर क्लिक करके आप अपनी समस्या की फ़ोटो या वीडियो जोड़ सकते हैं।';
      } else if (lower.includes('gps') || lower.includes('location') || lower.includes('sthan') || lower.includes('pata') || lower.includes('jagah')) {
        replyText =
          'स्क्रीन पर "Detect My Current GPS Location" बटन है, उस पर क्लिक करते ही आपका सटीक स्थान अपने आप मैप हो जाएगा।';
      } else if (lower.includes('submit') || lower.includes('jama') || lower.includes('bhejo') || lower.includes('ho gaya')) {
        replyText =
          'नीचे दिए गए चेकबॉक्स "I grant permission" पर टिक करके "Submit Verified Report" बटन दबा दीजिए, आपकी रिपोर्ट सीधे सरकारी पोर्टल पर जमा हो जाएगी।';
      } else if (lower.includes('road') || lower.includes('sadak') || lower.includes('tuti')) {
        replyText =
          'जी! आपकी टूटी हुई सड़क की रिपोर्ट तैयार करने के लिए मैंने ड्राफ्ट बना दिया है। कृपया स्क्रीन पर दिए गए "📍 GPS Location" और "📷 Photo/Video" बटन से अपना स्थान और फोटो जोड़ें।';
        reportDraft = {
          title: 'Damaged Road & Traffic Hazard',
          domain: 'Infrastructure & Roads',
          district: 'Ranchi',
          block: 'Namkum Block',
          priority: 'HIGH',
          description: lastUserMessage || 'Citizen reported broken road requiring urgent maintenance.',
          suggestedCapabilities: ['Road Construction', 'Civil Engineering', 'Local PWD'],
        };
      } else if (lower.includes('paani') || lower.includes('water')) {
        replyText =
          'जी! पानी की समस्या के लिए रिपोर्ट का ड्राफ्ट तैयार कर दिया गया है। कृपया नीचे "📍 GPS Location" और "📷 Photo/Video" बटन से स्थान जोड़ें।';
        reportDraft = {
          title: 'Drinking Water Contamination & Supply Disruption',
          domain: 'Water & Sanitation',
          district: 'Ranchi',
          block: 'Namkum Block',
          priority: 'HIGH',
          description: lastUserMessage || 'Citizen reported drinking water issue.',
          suggestedCapabilities: ['Water Chemistry', 'Environmental Testing', 'Hydrogeology'],
        };
      } else {
        replyText = `मैंने आपकी बात नोट कर ली है। कृपया स्क्रीन पर दिए गए GPS और फोटो बटन से जानकारी जोड़ें, या मुझसे कोई भी सवाल पूछें।`;
        reportDraft = {
          title: `Civic Signal: ${lastUserMessage.slice(0, 30)}...`,
          domain: 'Public Health',
          district: 'Ranchi',
          block: 'Namkum Block',
          priority: 'MEDIUM',
          description: lastUserMessage,
          suggestedCapabilities: ['Civic Engineering', 'Community Welfare'],
        };
      }
    }

    return NextResponse.json({
      reply: replyText,
      reportDraft,
    });
  } catch (error) {
    console.error('AI Chat endpoint error:', error);
    return NextResponse.json(
      {
        reply:
          'नमस्ते! जनसेतु प्लेटफॉर्म पर आपकी हर नागरिक समस्या दर्ज की जाती है। कृपया अपनी समस्या बताएं।',
        reportDraft: null,
      },
      { status: 500 }
    );
  }
}
