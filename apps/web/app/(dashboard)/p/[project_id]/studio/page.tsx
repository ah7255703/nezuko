'use client'
import { EmptyState } from '@/components/domain/EmptyState'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { SettingsIcon } from 'lucide-react'
import React from 'react'
import { useProject } from '../ProjectProvider'

export default function ProjectIndexPage() {
    const { project: { data: project } } = useProject()

    if (!project) {
        return <div className='size-full flex-center'>
            <EmptyState>
                <h2>Project not found!</h2>
            </EmptyState>
        </div>
    }

    return (
        <main className='w-full p-4 flex flex-col size-full'>
            <div className='rounded-lg border w-full bg-muted/50 flex items-center gap-2 p-2.5'>
                <div className='flex-1'>
                    <input type="text" className='w-full bg-transparent outline-none' />
                </div>
                <div>
                    <Button size='sm'>
                        Try
                    </Button>
                </div>
            </div>
            <ResizablePanelGroup direction="horizontal" className='flex-1'>
                <ResizablePanel minSize={40} data-container='schema-editor' className='py-2'>
                    <div className='rounded-lg border bg-muted/50 size-full'>

                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle className='mx-2' />
                <ResizablePanel minSize={40} data-container='json-viewer' className='py-2'>
                    <div className='rounded-lg border bg-muted/50 size-full'>

                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            <footer className='rounded-lg border w-full bg-muted/50 flex items-center gap-2 p-2.5 justify-between'>
                <div>
                    <Button size='xicon' variant='ghost'>
                        <SettingsIcon className='size-5' />
                    </Button>
                </div>
                <div>
                    <Button size='sm'>
                        Save
                    </Button>
                </div>
            </footer>
        </main>
    )
}