'use client'

import Script from 'next/script'

/**
 * Injeta o script do Meta Pixel (fbq.js) no <head>
 * Strategy: afterInteractive (não bloqueia FCP/LCP)
 */
export default function MetaPixelScript({ pixelId }) {
  if (!pixelId) return null

  return (
    <>
      {/* Base Pixel Code */}
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '${pixelId}', {
              em: 'enabled',
              external_id: 'enabled',
            });

            console.log('[Meta Pixel] Initialized:', {
              pixelId: '${pixelId}',
              advancedMatching: true
            });
          `,
        }}
      />

      {/* Noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
