'use client';

import { useEffect, useRef } from 'react';

const AdsterraBannerAd = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = ''; // <-- এই URL আপনার Adsterra কোড থেকে নিন
    script.async = true;

    adRef.current.innerHTML = ''; // Clear any previous ad
    adRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-[320px] sm:max-w-[468px] md:max-w-[728px] mx-auto">
      <div id="ad-container" ref={adRef}></div>
    </div>
  );
};

export default AdsterraBannerAd;
