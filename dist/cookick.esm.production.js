import e from"@babel/runtime/helpers/esm/objectSpread2";var t=decodeURIComponent;var r=encodeURIComponent;var i=/;\s*/;var n=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function o(e){var r=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{},n=r.decode,o=n===void 0?t:n;if(typeof e!=="string"){throw new TypeError("argument str must be a string")}var a={};var u=e.split(i);for(var f=0;f<u.length;f++){var c=u[f];var p=c.indexOf("=");if(p<0){continue}var d=c.substr(0,p).trim();var m=c.substr(++p,c.length).trim();if('"'===m[0]){m=m.slice(1,-1)}if(undefined===a[d]){a[d]=s(m,o)}}return a}function a(t,i,o){var a=e({},o);var s=a.encode||r;if(typeof s!=="function"){throw new TypeError("option encode is invalid")}if(!n.test(t)){throw new TypeError("argument name is invalid")}var c=s(i);if(c&&!n.test(c)){throw new TypeError("argument val is invalid")}var p=t+"="+c;if(!u(a.maxAge)){var d=a.maxAge-0;if(isNaN(d))throw new Error("maxAge should be a Number");var m=new Date;m.setTime(+m+d*1e3);a.expires=m}if(a.domain){if(!n.test(a.domain)){throw new TypeError("option domain is invalid")}p+="; domain="+a.domain}if(a.path){if(!n.test(a.path)){throw new TypeError("option path is invalid")}}if(a.path!==""){p+="; path="+(a.path?f(a.path):"/")}if(a.expires){if(typeof a.expires.toUTCString!=="function"){throw new TypeError("option expires is invalid")}p+="; expires="+a.expires.toUTCString()}if(a.httpOnly){p+="; httpOnly"}if(a.secure){p+="; secure"}if(a.sameSite){var v=typeof a.sameSite==="string"?a.sameSite.toLowerCase():a.sameSite;switch(v){case true:p+="; samesite=strict";break;case"lax":p+="; samesite=lax";break;case"strict":p+="; samesite=strict";break;case"none":p+="; samesite=none";break;default:throw new TypeError("option sameSite is invalid")}}return p}function s(e,t){try{return t(e)}catch(t){return e}}function u(e){return undefined===e||null===e}function f(e){var t=document.createElement("a");t.href=e;var r=/^http/i.test(t.href)?t.href:t.getAttribute("href",4);return r.split(/\/\/[^/]+/).slice(-1)[0]}var c={};var p=typeof document==="object";var d="";function m(e){var t=h();return t[e]}function v(e,t,r){var i=w(e,t,r);if(p){document.cookie=i}return i}function l(t,r){return v(t,"",e({},r,{expires:new Date(1970)}))}function h(){if(p){return o(d||document.cookie||"")}return o(d||"")}function w(t,r,i){return a(t,r,e({},c,{},i))}function g(e){return Object.assign(c,e)}function b(e){d=e}var y=Object.freeze({__proto__:null,getCookie:m,setCookie:v,delCookie:l,getAllCookies:h,serialize:w,setDefault:g,updateCookieSource:b});export default y;export{l as delCookie,h as getAllCookies,m as getCookie,w as serialize,v as setCookie,g as setDefault,b as updateCookieSource};
