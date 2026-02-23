"use client";

import { useEffect } from "react";

const NativeBannerAd = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ""; // your ads url

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full flex justify-center my-6">
      <div id="container-efd5bce8dc63414691d97134d1b2d3de" className="w-full max-w-sm" />
    </div>
  );
};

export default NativeBannerAd;
