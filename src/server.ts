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
    const { req, res } = asyncLocalStorage.getStore() || {};

    if (res) {
        if (typeof res.cookie === 'function') {
            res.cookie(name, val, {
                ...defaultOptions,
                ...options
            });

            if (req?.cookies) {
                req.cookies[name] = val;
            }
        } else {
            res.setHeader(
                'Set-Cookie',
                serialize(name, val, {
                    ...defaultOptions,
                    ...options
                })
            );
        }
    }
}

export function delCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>) {
    const { res } = asyncLocalStorage.getStore() || {};

    if (res) {
        if (typeof res.clearCookie === 'function') {
            res.clearCookie(name, {
                ...defaultOptions,
                ...options
            });
        } else {
            res.setHeader(
                'Set-Cookie',
                serialize(name, '', {
                    ...defaultOptions,
                    ...options,
                    expires: new Date(1970)
                })
            );
        }
    }
}

export function getAllCookies(): Record<string, any> {
    const { req } = asyncLocalStorage.getStore() || {};

    return req?.cookies || parse(req?.get('cookie') || '');
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