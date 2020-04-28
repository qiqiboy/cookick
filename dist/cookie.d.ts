import { CookieOptions } from './utils';
export declare function getCookie(name: string): string | undefined;
export declare function setCookie(name: string, val: string | number, options?: CookieOptions): string;
export declare function delCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>): string;
export declare function getAllCookies(): {
    [P: string]: string | undefined;
};
export declare function serialize(name: string, val: string | number, options?: CookieOptions): string;
export declare function setDefault(options: CookieOptions): CookieOptions;
export declare function updateCookieSource(cookie: string): void;
