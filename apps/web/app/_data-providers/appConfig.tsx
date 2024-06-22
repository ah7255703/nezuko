'use client';
import React, { useState } from "react";
import _, { cloneDeep, set as lodashSet } from 'lodash'
import { IS_SERVER } from "@/utils/constants";
import { createSafeContext } from "@/utils/create-safe-context";
import z from "zod";

const [SafeAppConfigProvider, useAppConfig] = createSafeContext<{
    state: Record<string, any>;
    set: <T extends any = unknown> (path: string, value: T) => void;
    get: <T extends any = unknown>(path: string) => T | undefined;
}>("");

type StorageType = "local" | "session";

const STORAGE_TYPE: StorageType = "local"

const KEY = "app-config";

const SYNC_TO_LOCAL_STORAGE = true;

const DEFAULT_ZODA_SCHEMA = z.record(z.any());

function getInitialData(storageType: StorageType, key: string) {
    if (IS_SERVER) return {};
    const storage = storageType === "local" ? localStorage : sessionStorage;
    let data: z.infer<typeof DEFAULT_ZODA_SCHEMA> = {};
    try {
        let dataString = storage.getItem(key);
        if (dataString) {
            let valid = DEFAULT_ZODA_SCHEMA.safeParse(JSON.parse(dataString));
            if (valid.success) {
                data = valid.data;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    return data;
}

function AppConfigProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState(getInitialData(STORAGE_TYPE, KEY));
    const set = React.useCallback((path: string, value: any) => {
        setState((prev) => {
            const newState = cloneDeep(prev);
            lodashSet(newState, path, value);
            if (SYNC_TO_LOCAL_STORAGE) {
                const storage = STORAGE_TYPE === "local" ? localStorage : sessionStorage;
                storage.setItem(KEY, JSON.stringify(newState));
            }
            return newState;
        });

    }, [setState])
    const get = React.useCallback((path: string) => _.get(state, path), [state])
    return <SafeAppConfigProvider value={{ get, set, state }}>{children}</SafeAppConfigProvider>;
}

function useConfigState<T extends any = unknown>(path: string, initial?: T): [T | undefined, (value: T) => void] {
    const { set, get } = useAppConfig();
    const value = get<T>(path) ?? initial;
    const setValue = (value: T) => set(path, value);
    return [value, setValue] as const;
}
export {
    useAppConfig,
    AppConfigProvider,
    useConfigState
}