declare module "codeceptjs/lib/mocha/bdd";

declare function Before(fn: () => Promise<void> | void): void;
declare function After(fn: () => Promise<void> | void): void;
