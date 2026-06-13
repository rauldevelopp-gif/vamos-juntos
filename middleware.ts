import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['es', 'en'],

  // Used when no locale matches
  defaultLocale: 'es',

  // Force language prefix in URL (/es, /en)
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames, skipping api, next assets, and public resources
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
