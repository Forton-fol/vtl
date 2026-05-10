export {};

declare module "*.png" {
  const src: string;
  export default src;
}

declare global {
  var GLOBAL_DEFAULT_LANG: "ru" | "en";
}
