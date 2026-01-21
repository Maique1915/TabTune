"use client";

import React, { useEffect } from "react";


type AdBannerProps = {
  clientId: string;
  slotId: string;
  style?: React.CSSProperties;
  className?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
};

export function AdBanner({ clientId, slotId, style, className, dataAdFormat, dataFullWidthResponsive }: AdBannerProps) {
  const initialized = React.useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [clientId, slotId]); // dependencies usually don't change, but good practice. actually empty array is fine if we want run-once.

  return (
    <div style={style} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={`ca-pub-${clientId}`}
        data-ad-slot={slotId}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
        data-ad-layout="in-article"
      ></ins>
    </div>
  );
}

export default AdBanner;