'use client'
import { clientApiReq } from "@/client/client-req";
import { createSafeContext } from "@/lib/createSafeContext";
import { InferResponseType } from "hono";
import React from "react";

type SS = InferResponseType<typeof clientApiReq.secured.org[":id"]['$get']>;

const [OrgDataSafeProvider, useOrgData] = createSafeContext<{
    data: NonNullable<SS>
}>();

function OrgDataProvider({ children, data }: { children: React.ReactNode, data: NonNullable<SS> }) {
    return <OrgDataSafeProvider value={{ data }}>{children}</OrgDataSafeProvider>;
}

export {
    useOrgData,
    OrgDataProvider
}