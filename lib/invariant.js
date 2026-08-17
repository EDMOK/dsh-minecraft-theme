//#region lib/types/invariant.js
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-minecraft-pixel";
const name = "client-ui-minecraft-pixel-invariant";
const inject = ["invariants"];
const install = () => {};
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
