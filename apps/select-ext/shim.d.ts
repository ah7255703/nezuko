import { ProtocolWithReturn } from "webext-bridge";
declare module "webext-bridge" {
    export interface ProtocolMap {
        ping: ProtocolWithReturn<{}, {}>;
        "selector-found": ProtocolWithReturn<{ selector: string }, {}>;
        "selector-not-found": ProtocolWithReturn<undefined, undefined>;
        "selector-error": ProtocolWithReturn<Error, undefined>;
        "get-selector": ProtocolWithReturn<{ element: Element }, {}>;
    }
}