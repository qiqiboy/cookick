import { parse, serialize, CookieOptions } from './utils';

const defaultOptions: CookieOptions = {};

export function getCookie(name: string) {
    const cookies = getAllCookies();

    return cookies[name];
}

export function setCookie(name: string, val: string | number, options?: CookieOptions) {
    if (typeof document === 'object') {
        document.cookie = serialize(name, val, {
            ...defaultOptions,
            ...options
        });
    }
}

export function delCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>) {
    setCookie(name, '', {
        ...options,
        expires: new Date(1970)
    });
}

export function getAllCookies() {
    return parse(typeof document === 'object' ? document.cookie || '' : '');
}

export function setDefault(options: CookieOptions) {
    return Object.assign(defaultOptions, options);
}
