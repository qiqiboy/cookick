'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var async_hooks = require('async_hooks');

/*!
 * Utilities for document.cookie, inherit from @jshttp/cookie
 *
 * @author qiqiboy
 */

/**
 * Module variables.
 * @private
 */
const decode = decodeURIComponent;
const encode = encodeURIComponent;
const pairSplitRegExp = /;\s*/;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
// eslint-disable-next-line
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

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
function parse(str) {
  let {
    decode: dec = decode
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }
  const obj = {};
  const pairs = str.split(pairSplitRegExp);
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    let eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }
    let key = pair.substr(0, eq_idx).trim();
    let val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' === val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined === obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }
  return obj;
}

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

function serialize(name, val, options) {
  const opt = {
    ...options
  };
  const enc = opt.encode || encode;
  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }
  const value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }
  let str = name + '=' + value;
  if (!isNone(opt.maxAge)) {
    const maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    const expiresDate = new Date();
    expiresDate.setTime(+expiresDate + maxAge * 1000);
    opt.expires = expiresDate;

    // str += '; max-age=' + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }
    str += '; domain=' + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }
  }
  if (opt.path !== '') {
    str += '; path=' + (opt.path ? getAbsolute(opt.path) : '/');
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }
    str += '; expires=' + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += '; httpOnly';
  }
  if (opt.secure) {
    str += '; secure';
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += '; samesite=strict';
        break;
      case 'lax':
        str += '; samesite=lax';
        break;
      case 'strict':
        str += '; samesite=strict';
        break;
      case 'none':
        str += '; samesite=none';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }
  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */
function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

/**
 * ensure obj is undefined or null
 */
function isNone(obj) {
  return undefined === obj || null === obj;
}

/**
 * get absolute path
 *
 * getAbsolute('../sub') => /parent/sub
 */
function getAbsolute(path) {
  const a = document.createElement('a');
  a.href = path;

  // @ts-ignore
  const uri = /^http/i.test(a.href) ? a.href : a.getAttribute('href', 4) || '';
  return uri.split(/\/\/[^/]+/).slice(-1)[0];
}

const defaultOptions = {};
const asyncLocalStorage = new async_hooks.AsyncLocalStorage();
function getCookie(name) {
  const cookies = getAllCookies();
  return cookies[name];
}
function setCookie(name, val, options) {
  const {
    res
  } = asyncLocalStorage.getStore() || {};
  res?.cookie(name, val, options || {});
}
function delCookie(name, options) {
  return setCookie(name, '', {
    ...options,
    expires: new Date(1970)
  });
}
function getAllCookies() {
  const {
    req
  } = asyncLocalStorage.getStore() || {};
  return parse(req?.get('Cookie') || '');
}
function serialize$1(name, val, options) {
  return serialize(name, val, {
    ...defaultOptions,
    ...options
  });
}
function setDefault(options) {
  return Object.assign(defaultOptions, options);
}
function middleware(req, res, next) {
  asyncLocalStorage.run({
    req,
    res
  }, () => next());
}
const COOKIE = {
  getCookie,
  setCookie,
  delCookie,
  getAllCookies,
  serialize: serialize$1,
  setDefault,
  middleware
};

exports.default = COOKIE;
exports.delCookie = delCookie;
exports.getAllCookies = getAllCookies;
exports.getCookie = getCookie;
exports.middleware = middleware;
exports.serialize = serialize$1;
exports.setCookie = setCookie;
exports.setDefault = setDefault;
