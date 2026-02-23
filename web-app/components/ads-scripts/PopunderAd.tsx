import { useEffect, useState } from 'react';
import { validateAdUrl } from '@/lib/ad-validation';

const PopunderAd = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const popunderScripts = [
      '',
      ''
    ];

    const loadScript = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const validation = validateAdUrl(url);
        if (!validation.isValid) {
          reject(new Error(validation.reason));
          return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = true;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load script'));

        document.head.appendChild(script);
      });
    };

    const initPopunder = async () => {
      const randomScript = popunderScripts[Math.floor(Math.random() * popunderScripts.length)];
      
      if (!randomScript) {
        return;
      }

      try {
        await loadScript(randomScript);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load popunder');
      }
    };

    initPopunder();

    return () => {
      popunderScripts.forEach(url => {
        const scripts = document.querySelectorAll(`script[src="${url}"]`);
        scripts.forEach(script => script.remove());
      });
    };
  }, []);

  return null;
};

export default PopunderAd;
