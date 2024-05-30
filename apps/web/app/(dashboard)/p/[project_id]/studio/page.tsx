'use client'
import { EmptyState } from '@/components/domain/EmptyState'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { SettingsIcon } from 'lucide-react'
import React from 'react'
import { useProject } from '../ProjectProvider'
import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from '@uiw/codemirror-theme-github'
import { basicDark } from '@uiw/codemirror-theme-basic'
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup'
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { ProjectSettingsPenel } from '../../_components/SettingsPanel'
import { useSearchParams } from '@/app/_hooks/useSearchParams'
import { cn } from '@/lib/utils'


export default function ProjectIndexPage() {
    const { project: { data: project } } = useProject()
    const { searchParams, setSearchParams } = useSearchParams();
    const isSettingsOpen = searchParams.get('settings') === 'true';

    if (!project) {
        return <div className='size-full flex-center'>
            <EmptyState>
                <h2>Project not found!</h2>
            </EmptyState>
        </div>
    }

    return (
        <div className='flex flex-row size-full p-4 gap-2 flex-1'>
            <aside className={cn('h-full w-full max-w-sm', isSettingsOpen ? "static" : "absolute -translate-x-[120%]")}>
                <ProjectSettingsPenel />
            </aside>
            <main className='w-full flex flex-col size-full flex-1 h-full'>
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
                        <div className='rounded-lg border size-full overflow-auto'>
                            <CodeMirror
                                className='first:size-full text-base'
                                value='{}'
                                height='100%'
                                extensions={[githubDark, basicSetup({
                                    lineNumbers: false,
                                    autocompletion: true,
                                    closeBrackets: true,
                                    foldGutter: false
                                }),
                                    json(),
                                    linter(jsonParseLinter())
                                ]}
                                theme="dark"
                                basicSetup={{
                                    lineNumbers: false,
                                    autocompletion: true,
                                }}
                            />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle className='mx-2' />
                    <ResizablePanel minSize={40} data-container='json-viewer' className='py-2'>
                        <div className='rounded-lg border size-full overflow-auto'>
                            <CodeMirror

                                className='first:size-full text-base'
                                value='{}'
                                readOnly
                                height='100%'
                                extensions={[basicDark, basicSetup({
                                    lineNumbers: false,
                                    autocompletion: true,
                                }), json()]}
                                theme="dark"
                            />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
                <footer className='rounded-lg border w-full bg-muted/50 flex items-center gap-2 p-2.5 justify-between'>
                    <div>
                        <Button size='xicon' variant='ghost' onClick={() => {
                            setSearchParams({ settings: !isSettingsOpen })
                        }}>
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
        </div>

    )
}