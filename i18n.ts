import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const activeLocale = locale && ['es', 'en'].includes(locale) ? locale : 'es';
  const common = (await import(`./locales/${activeLocale}/common.json`)).default;
  const home = (await import(`./locales/${activeLocale}/home.json`)).default;
  const services = (await import(`./locales/${activeLocale}/services.json`)).default;

  return {
    locale: activeLocale,
    messages: {
      ...common,
      ...home,
      ...services
    }
  };
});
