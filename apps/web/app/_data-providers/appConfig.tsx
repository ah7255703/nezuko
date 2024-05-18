'use client';
import React, { useState } from "react";
import _, { cloneDeep, set as lodashSet } from 'lodash'
import { IS_SERVER } from "@/utils/constants";
import { createSafeContext } from "@/utils/create-safe-context";

const [SafeAppConfigProvider, useAppConfig] = createSafeContext<{
    state: Record<string, any>;
    set: <T extends any = unknown> (path: string, value: T) => void;
    get: <T extends any = unknown>(path: string) => T;
}>("");

type StorageType = "local" | "session";

const STORAGE_TYPE: StorageType = "local"

const KEY = "app-config";
const SYNC_TO_LOCAL_STORAGE = true;

function getInitialData(storageType: StorageType, key: string) {
    if (IS_SERVER) return {};
    const storage = storageType === "local" ? localStorage : sessionStorage;
    const data = storage.getItem(key);
    return data ? JSON.parse(data) : {};
}

function AppConfigProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<Record<string, any>>(getInitialData(STORAGE_TYPE, KEY));
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