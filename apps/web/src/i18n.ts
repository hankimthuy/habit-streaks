import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'vi'];
export const defaultLocale = 'en';

export default getRequestConfig(async () => {
    const cookieStore = cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;

    const locale = (locales.includes(localeCookie as string) ? localeCookie : defaultLocale) as string;

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
