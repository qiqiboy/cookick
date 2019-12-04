import { CookieOptions } from './utils';
export declare function getCookie(name: string): string | undefined;
export declare function setCookie(name: string, val: string | number, options?: CookieOptions): void;
export declare function delCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>): void;
export declare function getAllCookies(): {
    [P: string]: string | undefined;
};
export declare function setDefault(options: CookieOptions): CookieOptions;
