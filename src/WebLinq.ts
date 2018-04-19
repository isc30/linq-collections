import * as LinqCollection from "./Linq";

declare const window: any;

window.LinqCollection = { ...window.LinqCollection, ...LinqCollection };
