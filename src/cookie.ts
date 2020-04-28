import { parse, serialize as cookieSerialize, CookieOptions } from './utils';

const defaultOptions: CookieOptions = {};
const isBrowser = typeof document === 'object';
let cookieSource: string = '';
let hasSetSource: boolean = false;

export function getCookie(name: string) {
    const cookies = getAllCookies();

    return cookies[name];
}

export function setCookie(name: string, val: string | number, options?: CookieOptions) {
    const cookie = serialize(name, val, options);

    if (isBrowser) {
        document.cookie = cookie;
    }

    return cookie;
}

export function delCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>) {
    return setCookie(name, '', {
        ...options,
        expires: new Date(1970)
    });
}

export function getAllCookies() {
    if (isBrowser) {
        return parse(cookieSource || document.cookie || '');
    }

    if (process.env.NODE_ENV === 'development' && !hasSetSource) {
        console.error(`Warning: You should call 'updateCookieSource(request.cookie)' first.`);
    }

    return parse(cookieSource || '');
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

export function updateCookieSource(cookie: string) {
    cookieSource = cookie;

    hasSetSource = true;
}
