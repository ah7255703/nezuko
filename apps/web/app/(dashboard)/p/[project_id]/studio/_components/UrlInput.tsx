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

    useEditable(inputRef, (text, pos) => {
        handleChange(text);
        onChange(text);
        console.log(text, pos);
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
        <div ref={inputRef} className={cn('w-full outline-none text-base font-medium font-mono', isValid ? "" : "text-destructive")}>
            {
                urlParts ? (
                    <div>
                        <span className='text-emerald-400'>{urlParts.protocol}//</span>
                        <span className='text-yellow-500'>{urlParts.hostname}</span>
                        <span className='text-rose-500'>{urlParts.pathname}</span>
                        <span className='text-blue-500'>{urlParts.search}</span>
                        <span className='text-purple-500'>{urlParts.hash}</span>
                    </div>
                ) : <div className={cn(isValid ? "" : "text-destructive")}>
                    {value}
                </div>
            }
        </div>
    );
};