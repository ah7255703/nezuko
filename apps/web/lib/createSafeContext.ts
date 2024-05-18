import React from "react";

export function createSafeContext<T extends unknown = any>(defaultValue?: T) {
    const Context = React.createContext(defaultValue as T);
    const Provider = Context.Provider
    return [
        Provider,
        () => React.useContext(Context)
    ] as const
}