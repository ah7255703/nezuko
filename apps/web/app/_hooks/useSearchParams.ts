"use client";
import {
    useSearchParams as useNextSearchParams,
    usePathname,
    useRouter,
} from "next/navigation";

type ValueType = string | number | boolean | undefined;

export function useSearchParams() {
    const params = useNextSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    return {
        searchParams: params,
        setSearchParams: (keys: Record<string, ValueType>) => {
            const newParams = new URLSearchParams(params);
            for (const key in keys) {
                const value = keys[key];
                if (value === undefined) {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            }
            router.replace(pathname + "/?" + newParams.toString(), { scroll: false });
        },
    };
}