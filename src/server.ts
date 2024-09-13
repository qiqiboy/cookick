import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response } from 'express';
import { parse, serialize as cookieSerialize, CookieOptions } from './utils';

const defaultOptions: CookieOptions = {};
const asyncLocalStorage = new AsyncLocalStorage<{
    req: Request;
    res: Response;
}>();

export function getCookie(name: string) {
    const cookies = getAllCookies();

    return cookies[name];
}

export function setCookie(name: string, val: string | number, options?: CookieOptions) {
    const { res } = asyncLocalStorage.getStore() || {};

    res?.cookie(name, val, options || {});
}

export function delCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>) {
    return setCookie(name, '', {
        ...options,
        expires: new Date(1970)
    });
}

export function getAllCookies() {
    const { req } = asyncLocalStorage.getStore() || {};

    return parse(req?.get('Cookie') || '');
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

export function middleware(req: Request, res: Response, next) {
    asyncLocalStorage.run(
        {
            req,
            res
        },
        () => next()
    );
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
