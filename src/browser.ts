import { parse, serialize as cookieSerialize, CookieOptions } from './utils';

const defaultOptions: CookieOptions = {};

export function getCookie(name: string) {
    const cookies = getAllCookies();

    return cookies[name];
}

export function setCookie(name: string, val: string | number, options?: CookieOptions) {
    const cookie = serialize(name, val, options);

    document.cookie = cookie;
}

export function delCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>) {
    return setCookie(name, '', {
        ...options,
        expires: new Date(1970)
    });
}

export function getAllCookies() {
    return parse(document.cookie || '');
}

export function serialize(name: string, val: string | number, options?: CookieOptions) {
    return cookieSerialize(name, val, {
        ...defaultOptions,
        ...options
    });
}

export function setDefault(options: CookieOptions) {
    return Object.assign(defaultOptions, options);
}

export function middleware() {
    console.error(`'middleware' can only be called in Nodejs.`);
}

const COOKIE = {
    getCookie,
    setCookie,
    delCookie,
    getAllCookies,
    serialize,
    setDefault,
    middleware
};

export default COOKIE;

declare global {
    const cookick: typeof COOKIE;
    interface Window {
        cookick: typeof COOKIE;
    }
}
