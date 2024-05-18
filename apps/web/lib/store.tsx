"use client";
// https://github.com/openchatai/superpowers/blob/main/packages/little-store/src/StoreImpl.ts
import { produce } from "immer";
import { useSyncExternalStore } from "react";

type UpdaterFunction<T> = (oldValue: T) => T;

type Listener<T> = (value: T) => void;

export abstract class Store<T extends any = any, S extends unknown = unknown> {
    protected value: T;
    protected options: S | undefined;
    listeners = new Set<Listener<T>>();

    constructor(initialValue: T, options?: S) {
        this.value = initialValue;
        if (options) {
            this.options = options
        }
    }

    setValue = (newValue: T | UpdaterFunction<T>) => {
        if (typeof newValue === "function") {
            this.value = (newValue as UpdaterFunction<T>)(this.value as T);
        } else {
            this.value = newValue;
        }
        this.notify();
    };

    setValueImmer = (updater: (draft: T) => void) => {
        this.setValue(produce(this.value, updater));
    };

    getValue = () => {
        return this.value;
    };

    unSubscribe = (listener: Listener<T>) => {
        this.listeners.delete(listener);
    };

    subscribe = (listener: Listener<T>) => {
        this.listeners.add(listener);
        return () => {
            this.unSubscribe(listener);
        };
    };

    addEventListener = this.subscribe;

    notify = () => {
        this.listeners.forEach((l) => l(this.value as T));
    };
}


// export function useStore<T>(
//   store: Store<T>,
//   // typeof the store.key selected
//   selector?: <K extends keyof T, S extends T[K]>(state: T) => S
// ) {
//   const cb = selector ? () => selector(store.getValue()) : store.getValue;

//   return useSyncExternalStore(store.subscribe, cb, cb);
// }

export function useStore<T = unknown>(store: Store<T>) {
    return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}