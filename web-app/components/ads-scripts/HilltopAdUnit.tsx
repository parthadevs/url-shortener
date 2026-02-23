'use client';

import { useEffect, useRef, useState } from 'react';
import { validateAdUrl } from '@/lib/ad-validation';

interface HilltopAdUnitProps {
  adUrl: string;
  key: number;
}

const HilltopAdUnit = ({ adUrl, key }: HilltopAdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!adRef.current) return;

    const validation = validateAdUrl(adUrl);
    if (!validation.isValid) {
      setError(validation.reason || 'Invalid ad URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = adUrl;
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';

    script.onload = () => setIsLoading(false);
    script.onerror = () => {
      setError('Failed to load ad');
      setIsLoading(false);
    };

    adRef.current.innerHTML = '';
    adRef.current.appendChild(script);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [adUrl]);

  if (error) {
    return null;
  }

  return (
    <div ref={adRef} key={key} className='overflow-hidden flex justify-center min-h-[100px] items-center'>
      {isLoading && <div className="animate-pulse bg-muted h-[250px] w-[300px] rounded" />}
    </div>
  );
};

export default HilltopAdUnit;
