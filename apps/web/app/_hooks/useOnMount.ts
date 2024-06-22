'use client';
import { useRef, useEffect } from "react";

export function useOnMount(fn: () => void) {
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            fn();
        }
    }, []);
}