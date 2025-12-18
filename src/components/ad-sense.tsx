import Script from "next/script";
import React from "react";

type AdSenseProps = {
  clientId: string;
};

export function AdSense({ clientId }: AdSenseProps) {
  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${clientId}`}
      crossOrigin="anonymous"
      async
    >
    </Script>
  );
}

export default AdSense;