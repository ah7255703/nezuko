import { clientApiReq } from "@/client/client-req";
import { createSafeContext } from "@/lib/createSafeContext";
import { InferResponseType } from "hono";
import React from "react";

type Data = InferResponseType<typeof clientApiReq.secured.org[":id"]["$get"]>;

const [OrgDataSafeProvider, useOrgData] = createSafeContext<{}>();

export function OrgDataProvider({ children }: { children: React.ReactNode }) {
    return <OrgDataSafeProvider value={{}}>{children}</OrgDataSafeProvider>;
}