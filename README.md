# cookick

A simple utilities for browser cookies APIs

<!-- vim-markdown-toc GFM -->

* [为什么](#为什么)
* [安装](#安装)
* [如何使用](#如何使用)
    - [`getCookie`](#getcookie)
    - [`setCookie`](#setcookie)
    - [`delCookie`](#delcookie)
    - [`getAllCookies`](#getallcookies)
* [参考文档](#参考文档)
    - [document.cookie MDN 规范说明](#documentcookie-mdn-规范说明)
    - [`maxAge` `sameSite`等新属性的兼容性](#maxage-samesite等新属性的兼容性)

<!-- vim-markdown-toc -->

## 为什么

已经有非常多的 cookie 相关工具了，设置多年以前，在我初次接触 js 学习之处，也折腾过 [`COOKIE`](https://github.com/qiqiboy/COOKIE) 这么个小玩意儿。

但是当我现在需要一个足够简单（现代 web 开发中，有着更多强大、丰富的本地存储方案，js 对于 cookie 的依赖越来越少）、支持标准的 cookie 工具时，我发现目前我能找到的各类 cookie 库（例如 `js-cookie`、`jquery-cookie`甚至还有`react-cookie`？？？）都或多或少存在一些问题，有些破坏了标准，有些不支持较新的标准，有些是过度设计，过于繁重（[`COOKIE`](https://github.com/qiqiboy/COOKIE)就是过度设计了）。

而直到我发现了 [jshttp/cookie](https://github.com/jshttp/cookie) 这个标准库，虽然其是针对 `HTTP cookies` 规范定制，但是可以几乎完整适用于浏览器端。所以我基于该库做了稍微的修改定制，也就有了现在这个 `cookick`（由 `cookie` 和 `kick` 组合而来）

## 安装

```bash
// use npm
$ npm install cookick --save

// use yarn
$ yarn add cookick
```

**注意**：`cookick`也提供了`umd`格式的包，你可以在页面中引入代码文件后 `<script src="/YOUR_FILES/cookick.umd.production.js" />`，直接通过`window.cookick`调用。

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
    expires?: Date;
    maxAge?: number;
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

// 设置过期时间，不需要兼容ie6/7情况下，建议使用maxAge参数: https://javascript.info/cookie#expires-max-age
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
declare function delCookie(name: string, options?: CookieOptions): void;
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

## 参考文档

### document.cookie MDN 规范说明

-   https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie

### `maxAge` `sameSite`等新属性的兼容性

-   https://javascript.info/cookie#expires-max-age
-   https://caniuse.com/#feat=mdn-http_headers_set-cookie_max-age
-   https://caniuse.com/#feat=same-site-cookie-attribute
