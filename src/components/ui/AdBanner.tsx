/*
  AdSense Banner Placeholder
  To enable ads, uncomment usages in pages and set env keys.

  Example usage (keep commented until approved):
  // Ad placeholder - uncomment when ads approved
  // <AdBanner dataAdSlot={import.meta.env.VITE_AD_SLOT_HEADER} />
*/

import React from "react";


interface AdBannerProps {
  dataAdSlot?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AdBanner: React.FC<AdBannerProps> = ({ dataAdSlot, className }) => {
  return (
    <div className={className} aria-hidden>
      {/* Google AdSense code would go here when enabled */}
      {/* <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={import.meta.env.VITE_AD_CLIENT}
            data-ad-slot={dataAdSlot}
            data-ad-format="auto"
            data-full-width-responsive="true" /> */}
    </div>
  );
};
