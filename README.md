# cookick

A simple utilities for browser cookies APIs

[![npm](https://img.shields.io/npm/v/cookick.svg?style=flat)](https://npm.im/cookick)
[![definitionTypes](https://img.shields.io/npm/types/cookick.svg)](https://github.com/qiqiboy/cookick/blob/master/index.d.ts)
[![gzip](http://img.badgesize.io/https://unpkg.com/cookick/dist/cookick.umd.production.js?compression=gzip&color=green)](https://npm.im/cookick)
[![download](https://img.shields.io/npm/dm/cookick.svg)](https://npm.im/cookick)
[![issues](https://img.shields.io/github/issues/qiqiboy/cookick.svg)](https://github.com/qiqiboy/cookick/issues)
[![license](https://img.shields.io/github/license/qiqiboy/cookick.svg)](https://github.com/qiqiboy/cookick/blob/master/LICENSE)
[![github](https://img.shields.io/github/last-commit/qiqiboy/cookick.svg)](https://github.com/qiqiboy/cookick)
[![github](https://img.shields.io/github/commit-activity/m/qiqiboy/cookick.svg)](https://github.com/qiqiboy/cookick/commits/master)
[![github](https://img.shields.io/github/stars/qiqiboy/cookick.svg?style=social)](https://github.com/qiqiboy/cookick)

<!-- vim-markdown-toc GFM -->

* [为什么](#为什么)
* [安装](#安装)
    - [运行环境要求](#运行环境要求)
* [如何使用](#如何使用)
    - [`getCookie`](#getcookie)
    - [`setCookie`](#setcookie)
    - [`delCookie`](#delcookie)
    - [`getAllCookies`](#getallcookies)
    - [`serialize`](#serialize)
    - [`setDefault`](#setdefault)
* [参考文档](#参考文档)
    - [document.cookie MDN 规范说明](#documentcookie-mdn-规范说明)
    - [`maxAge` `sameSite`等新属性的兼容性](#maxage-samesite等新属性的兼容性)

<!-- vim-markdown-toc -->

## 为什么

已经有非常多的 cookie 相关工具了，甚至多年以前，在我初次接触 js 学习之处，也折腾过 [`COOKIE`](https://github.com/qiqiboy/COOKIE) 这么个小玩意儿。

但是当我现在需要一个足够简单（现代 web 开发中，有着更多强大、丰富的本地存储方案，js 对于 cookie 的依赖越来越少）、支持标准的 cookie 工具时，我发现目前我能找到的各类 cookie 库（例如 `js-cookie`、`jquery-cookie`甚至还有`react-cookie`？？？）都或多或少存在一些问题，有些破坏了标准，有些不支持较新的标准，有些是过度设计，过于繁重（[`COOKIE`](https://github.com/qiqiboy/COOKIE)就是过度设计了）。

而直到我发现了 [jshttp/cookie](https://github.com/jshttp/cookie) 这个标准库，虽然其是针对 `HTTP cookies` 规范定制，但是可以几乎完整适用于浏览器端。所以我基于该库做了稍微的修改定制，也就有了现在这个 `cookick`（名字由 `cookie` 和 `kick` 组合而来）

## 安装

[![cookick](https://nodei.co/npm/cookick.png?compact=true)](https://npm.im/cookick)

```bash
// use npm
$ npm install cookick --save

// use yarn
$ yarn add cookick
```

**注意**：`cookick`也提供了`umd`格式的包，你可以将`cookick`的`umd`包传到服务器上，然后通过`script`标签在页面中引入，直接通过`window.cookick`调用。

```html
<!-- from self hosted cdn -->
<script src="{{ YOUR_CDN_URL }}/browser.umd.js"></script>

<!-- from unpkg -->
<script src="https://unpkg.com/cookick/dist/browser.umd.js"></script>

<!-- from jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/cookick/dist/browser.umd.js"></script>
```

### 运行环境要求

`cookick`支持在浏览器端和服务器端(express+Nodejs)运行。如果要在服务器端运行，需要在调用前挂载 middleware：

```typescript
import { middleware } from 'cookick';

app.use(middleware);
```

nodejs需要支持`AsyncLocalStorage`，最低版本要求为`v12.17.0`。

## 如何使用

`cookick`提供了一组方法用于获取或者设置 cookie。

### `getCookie`

```typescript
declare function getCookie(name: string): string | undefined;
```

使用示例：

```typescript
import { getCookie } from 'cookick';

getCookie('foo'); // 获取名称为 foo 的cookie
```

### `setCookie`

```typescript
interface CookieOptions {
    path?: string;
    domain?: string;
    expires?: Date; // 必须是Date对象
    maxAge?: number; // 整数，表示maxAge秒后过期。建议总是使用maxAge，不要使用expires。maxAge和expires如果同时存在，会忽略expires参数
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
}

declare function setCookie(name: string, val: string | number, options?: CookieOptions): void;
```

使用示例：

```typescript
import { setCookie } from 'cookick';

// 默认调用：在当前域下，path=/， 创建foo=bar的cookie
setCookie('foo', 'bar');

// 指定path参数
setCookie('foo', 'bar', {
    path: '/sub'
    // 甚至可以使用相对路径
    // path: '../another/sub'
});

// 设置doamin
setCookie('foo', 'bar', {
    domain: 'cookie.com'
});

// 设置过期时间，建议使用maxAge参数，设置过期秒数: https://javascript.info/cookie#expires-max-age
setCookie('foo', 'bar', {
    maxAge: 60 * 60 * 24 * 7
});

// 设置 secure、httpOnly、sameSite等
// 这些属性并不是所有浏览器都支持，有些目前仅在 server-http 协议支持，请使用前慎重考虑
setCookie('foo', 'bar', {
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
});
```

### `delCookie`

```typescript
declare function delCookie(
    name: string,
    options?: {
        path?: string;
        domain?: string;
    }
): void;
```

使用示例：

```typescript
import { delCookie } from 'cookick';

delCookie('foo'); // 删除名称为 foo 的cookie

// 如果cookie在其他子路径或者domain下，需要指定明确的path或者domain才能删除
delCookie('foo', {
    path: '/sub'
});
```

### `getAllCookies`

```typescript
declare function getAllCookies(): {
    [P: string]: string | undefined;
};
```

使用示例：

```typescript
import { getAllCookies } from 'cookick';

getAllCookies(); // 解析所有的cookie为一个object对象
```

### `serialize`

```typescript
declare function serialize(name: string, val: string | number, options?: CookieOptions): string;
```

序列化一个新的 cookie 为字符串，你可以将其用于在服务端或者浏览器端设置 cookie：

```typescript
const newCookieStr = serialize('foo', 'bar', {
    path: '/'
});

// 浏览器端
document.cookie = newCookieStr;

// 服务端
response.setHeader('set-cookie', newCookieStr);
```

### `setDefault`

设置默认参数

```typescript
declare function setDefault(options: CookieOptions): CookieOptions;
```

使用示例：

```typescript
import { setDefault } from 'cookick';

// 在调用 setCookie 没有传递path、domain情况下，会总是将cookie根据默认参数进行设置
setDefault({
    path: '/basename',
    domain: '.root.domain'
});
```

## 参考文档

### document.cookie MDN 规范说明

-   https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie

### `maxAge` `sameSite`等新属性的兼容性

-   https://javascript.info/cookie#expires-max-age
-   https://caniuse.com/#feat=mdn-http_headers_set-cookie_max-age
-   https://caniuse.com/#feat=same-site-cookie-attribute
