import { Request, Response } from 'express';
import { CookieOptions } from './utils';
export declare function getCookie(name: string): any;
export declare function setCookie(name: string, val: string | number, options?: CookieOptions): void;
export declare function delCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>): void;
export declare function getAllCookies(): Record<string, any>;
export declare function serialize(name: string, val: string | number, options?: CookieOptions): string;
export declare function setDefault(options: CookieOptions): CookieOptions;
export declare function middleware(req: Request, res: Response, next: any): void;
declare const COOKIE: {
    getCookie: typeof getCookie;
    setCookie: typeof setCookie;
    delCookie: typeof delCookie;
    getAllCookies: typeof getAllCookies;
    serialize: typeof serialize;
    setDefault: typeof setDefault;
    middleware: typeof middleware;
};
export default COOKIE;
