export default function Head() {
  return (
    <head>
      <link rel='icon' href='/favicon.ico' sizes='any' />
      <meta name='google-adsense-account' content={process.env.NEXT_PUBLIC_ADSENSE_ACCOUNT ?? ''} />
      <meta property='og:url' content={process.env.NEXT_PUBLIC_APP_URI ?? ''} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={process.env.NEXT_PUBLIC_APP_NAME ?? 'NextJS Application'} />
      <meta
        property='og:description'
        content={process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? 'An application built with NextJS.'}
      />
      <meta
        property='og:image'
        content={process.env.NEXT_PUBLIC_APP_LOGO_URI || `${process.env.NEXT_PUBLIC_APP_URI}/favicon.ico`}
      />
    </head>
  );
}
