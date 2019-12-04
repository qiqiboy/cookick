import * as COOKIE from './cookie';
export * from './cookie';
export default COOKIE;
declare global {
    const cookick: typeof COOKIE;
    interface Window {
        cookick: typeof COOKIE;
    }
}
