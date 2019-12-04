/*!
 * Utilities for document.cookie, inherit from @jshttp/cookie
 *
 * @author qiqiboy
 */
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */
export declare function parse(str: string, { decode: dec }?: {
    decode?: typeof decodeURIComponent | undefined;
}): {
    [P: string]: string | undefined;
};
/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */
export interface CookieOptions {
    path?: string;
    domain?: string;
    expires?: Date;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    encode?: typeof encodeURIComponent;
}
export declare function serialize(name: string, val: number | string, options?: CookieOptions): string;
