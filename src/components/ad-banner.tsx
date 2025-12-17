"use client";

import React, { useEffect } from "react";
import { AdSense } from "./ad-sense";

type AdBannerProps = {
  clientId: string;
  slotId: string;
  style?: React.CSSProperties;
  className?: string;
  dataAdFormat?: string;
    dataFullWidthResponsive?: string;
};

export function AdBanner({ clientId, slotId, style, className, dataAdFormat, dataFullWidthResponsive }: AdBannerProps) {
    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

  return (
    <div style={style} className={className}>
      <AdSense clientId={clientId} />
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