'use server';

import { cookies } from 'next/headers';

export async function setUserLocale(locale: string) {
    cookies().set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 31536000 // 1 year
    });
}
