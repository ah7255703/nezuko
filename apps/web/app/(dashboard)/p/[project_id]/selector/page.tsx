"use client";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { UrlInput } from "../studio/_components/UrlInput";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

export default function SelectorStudio() {
    const [url, setUrl] = useState('https://anime4zer.site/anime/tensei-shitara-slime-datta-ken-3rd-season/')
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    const loadCb = useCallback((ev: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            document.addEventListener("click", (ev) => {
                if (iframe.contentWindow?.document.body.contains(ev.target as Node)) {
                    toast.error("You clicked on the iframe")
                }
            })
        }
    }, [iframeRef])

    const proxiedUrl = "http://localhost:3001/proxy?url=" + url
    return <div className='flex flex-row size-full p-4 gap-2 flex-1 max-h-full overflow-auto'>
        <main className='w-full flex flex-col size-full flex-1 h-full'>
            <div className='rounded-lg border w-full h-14 bg-muted/50 flex flex-row items-center justify-center gap-2'>
                <UrlInput value={url} onChange={(value) => {
                    setUrl(value)
                }}
                />
            </div>
            <ResizablePanelGroup direction="horizontal" className='flex-1 overflow-hidden'>
                <ResizablePanel minSize={40} data-container='schema-editor' className='py-2'>
                    <div className='rounded-lg border size-full overflow-auto'>

                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle className='mx-2' />
                <ResizablePanel minSize={60} data-container='json-viewer' className='py-2'>
                    <div className='rounded-lg border size-full overflow-auto'>
                        <iframe onLoad={loadCb} ref={iframeRef} className="size-full" src={proxiedUrl}></iframe>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    </div>
}