(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.cookick = {}));
}(this, (function (exports) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var objectSpread2 = _objectSpread2;

  /*!
   * Utilities for document.cookie, inherit from @jshttp/cookie
   *
   * @author qiqiboy
   */

  /**
   * Module variables.
   * @private
   */
  var decode = decodeURIComponent;
  var encode = encodeURIComponent;
  var pairSplitRegExp = /;\s*/;
  /**
   * RegExp to match field-content in RFC 7230 sec 3.2
   *
   * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
   * field-vchar   = VCHAR / obs-text
   * obs-text      = %x80-FF
   */
  // eslint-disable-next-line

  var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
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
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$decode = _ref.decode,
        dec = _ref$decode === void 0 ? decode : _ref$decode;

    if (typeof str !== 'string') {
      throw new TypeError('argument str must be a string');
    }

    var obj = {};
    var pairs = str.split(pairSplitRegExp);

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      var eq_idx = pair.indexOf('='); // skip things that don't look like key=value

      if (eq_idx < 0) {
        continue;
      }

      var key = pair.substr(0, eq_idx).trim();
      var val = pair.substr(++eq_idx, pair.length).trim(); // quoted values

      if ('"' === val[0]) {
        val = val.slice(1, -1);
      } // only assign once


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
    var opt = objectSpread2({}, options);

    var enc = opt.encode || encode;

    if (typeof enc !== 'function') {
      throw new TypeError('option encode is invalid');
    }

    if (!fieldContentRegExp.test(name)) {
      throw new TypeError('argument name is invalid');
    }

    var value = enc(val);

    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError('argument val is invalid');
    }

    var str = name + '=' + value;

    if (!isNone(opt.maxAge)) {
      var maxAge = opt.maxAge - 0;
      if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
      var expiresDate = new Date();
      expiresDate.setTime(+expiresDate + maxAge * 1000);
      opt.expires = expiresDate; // str += '; max-age=' + Math.floor(maxAge);
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
      var sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;

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
    var a = document.createElement('a');
    a.href = path; // @ts-ignore

    var uri = /^http/i.test(a.href) ? a.href : a.getAttribute('href', 4);
    return uri.split(/\/\/[^/]+/).slice(-1)[0];
  }

  var defaultOptions = {};
  var isBrowser = typeof document === 'object';
  var cookieSource = '';
  var hasSetSource = false;
  function getCookie(name) {
    var cookies = getAllCookies();
    return cookies[name];
  }
  function setCookie(name, val, options) {
    var cookie = serialize$1(name, val, options);

    if (isBrowser) {
      document.cookie = cookie;
    }

    return cookie;
  }
  function delCookie(name, options) {
    return setCookie(name, '', objectSpread2({}, options, {
      expires: new Date(1970)
    }));
  }
  function getAllCookies() {
    if (isBrowser) {
      return parse(cookieSource || document.cookie || '');
    }

    if ( !hasSetSource) {
      console.error("Warning: You should call 'updateCookieSource(request.cookie)' first.");
    }

    return parse(cookieSource || '');
  }
  function serialize$1(name, val, options) {
    return serialize(name, val, objectSpread2({}, defaultOptions, {}, options));
  }
  function setDefault(options) {
    return Object.assign(defaultOptions, options);
  }
  function updateCookieSource(cookie) {
    cookieSource = cookie;
    hasSetSource = true;
  }

  var COOKIE = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getCookie: getCookie,
    setCookie: setCookie,
    delCookie: delCookie,
    getAllCookies: getAllCookies,
    serialize: serialize$1,
    setDefault: setDefault,
    updateCookieSource: updateCookieSource
  });

  exports.default = COOKIE;
  exports.delCookie = delCookie;
  exports.getAllCookies = getAllCookies;
  exports.getCookie = getCookie;
  exports.serialize = serialize$1;
  exports.setCookie = setCookie;
  exports.setDefault = setDefault;
  exports.updateCookieSource = updateCookieSource;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
