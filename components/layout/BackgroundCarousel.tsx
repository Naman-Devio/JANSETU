'use client';

import React, { useEffect, useState } from 'react';

const BACKGROUND_IMAGES = [
  '/assets/water.webp',
  '/assets/1663908248_delhi-rain.jpg',
  '/assets/20160528_blp517.webp',
  '/assets/Copy-of-OP-Wordpress-Thumbnail-98-1024x768.jpg',
  '/assets/R.jpg',
  '/assets/RTR2HFZN.jpg',
  '/assets/ch1774039.webp',
  '/assets/dd4414078116c790d2764fd6669c0171.jpg',
  '/assets/fb-fea_orig.jpg',
];

export const BackgroundCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Revolve background images every 60,000 ms (1 minute) per user request
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 pointer-events-none -z-50 overflow-hidden bg-[#090b0e]">
      {BACKGROUND_IMAGES.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image with light Gaussian blur (blur-[3px]) so it remains clearly visible */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[3px] scale-105"
              style={{ backgroundImage: `url('${src}')` }}
            />
          </div>
        );
      })}

      {/* Balanced semi-transparent dark overlay to ensure readable UI contrast while showcasing the image */}
      <div className="absolute inset-0 bg-black/60 backdrop-brightness-75" />
    </div>
  );
};
