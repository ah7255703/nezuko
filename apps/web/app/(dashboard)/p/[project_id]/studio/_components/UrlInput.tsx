'use client';
import { cn } from '@/lib/utils';
import React, { useState, useRef, useMemo } from 'react';
import { useEditable } from 'use-editable';
import { z } from 'zod';

export const UrlInput = ({ value, onChange }: {
    value: string;
    onChange: (value: string) => void;
}) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [isValid, setValid] = useState(true)
    function handleChange(value: string) {
        const v = z.string().url().safeParse(value);
        setValid(v.success);
    }
    const [hasFocus, setHasFocus] = useState(false);
    useEditable(inputRef, (text, pos) => {
        handleChange(text);
        onChange(text);
    }, {
        disabled: !hasFocus
    });

    const urlParts = useMemo(() => {
        if (value && value.length > 0) {
            try {
                const url = new URL(value);
                return {
                    protocol: url.protocol,
                    hostname: url.hostname,
                    pathname: url.pathname !== '/' ? url.pathname : '',
                    search: url.search,
                    hash: url.hash,
                };
            } catch (e) {
                return null;
            }
        }
        return null;
    }, [value]);


    return (
        <div ref={inputRef}
            onClick={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            className={cn('w-full h-fit p-2 flex-1 outline-none text-base font-medium font-mono', isValid ? "" : "text-destructive")} >
            {
                urlParts ? (
                    <div>
                        <span className='text-emerald-400'>{urlParts.protocol}//</span>
                        <span className='text-yellow-500'>{urlParts.hostname}</span>
                        <span className='text-rose-500'>{urlParts.pathname}</span>
                        <span className='text-blue-500'>{urlParts.search}</span>
                        <span className='text-purple-500'>{urlParts.hash}</span>
                    </div >
                ) :
                    value
            }
        </div >
    );
};