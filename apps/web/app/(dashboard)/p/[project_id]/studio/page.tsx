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
import { useStudio } from './StudioProvider'
import { clientApiReq } from '@/client/client-req'
import { UrlInput } from './_components/UrlInput'


export default function ProjectIndexPage() {
    const { project: { data: project } } = useProject()
    const { searchParams, setSearchParams } = useSearchParams();
    const isSettingsOpen = searchParams.get('settings') === 'true';
    const { state, dispatch } = useStudio();

    if (!project) {
        return <div className='size-full flex-center'>
            <EmptyState>
                <h2>Project not found!</h2>
            </EmptyState>
        </div>
    }

    return (
        <div className='flex flex-row size-full p-4 gap-2 flex-1 max-h-full overflow-auto'>
            <aside className={cn('h-full w-full max-w-sm block', isSettingsOpen ? "static" : "absolute -translate-x-[120%]")}>
                <ProjectSettingsPenel />
            </aside>
            <main className='w-full flex flex-col size-full flex-1 h-full'>
                <div className='rounded-lg border w-full bg-muted/50 flex flex-row items-center gap-2 p-1'>
                    <UrlInput value={state.request.url} onChange={(value) => {
                        dispatch({
                            type: 'setRequest',
                            payload: {
                                url: value
                            }
                        })
                    }}
                    />
                    <div>
                        <Button size='sm' onClick={async () => {
                            const req = await clientApiReq.secured.projects[':projectId'].try.$post({
                                param: {
                                    projectId: project.id
                                },
                                json: {
                                    schemaString: state.schema.value,
                                    request: state.request
                                }
                            })
                            const res = await req.json();
                            if (res.$_response) {
                                dispatch({
                                    type: 'setLastResponse',
                                    payload: JSON.stringify(res.$_response, null, 2)
                                })
                            }
                        }}>
                            Try
                        </Button>
                    </div>
                </div>
                <ResizablePanelGroup direction="horizontal" className='flex-1 overflow-hidden'>
                    <ResizablePanel minSize={40} data-container='schema-editor' className='py-2'>
                        <div className='rounded-lg border size-full overflow-auto'>
                            <CodeMirror
                                className='first:size-full text-base'
                                value={state.schema.value}
                                onChange={(value) => {
                                    dispatch({
                                        type: "setSchema",
                                        payload: {
                                            value: value,
                                        }
                                    })
                                }}
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
                            {state.state.lastResponse ? <CodeMirror
                                className='first:size-full text-base'
                                value={state.state.lastResponse || ''}
                                readOnly
                                height='100%'
                                extensions={[basicDark, basicSetup({
                                    lineNumbers: false,
                                    autocompletion: true,
                                }), json()]}
                                theme="dark"
                            /> : <EmptyState>
                                <h2>No response yet</h2>
                            </EmptyState>}
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
                        <Button size='sm' onClick={async () => {
                            dispatch({
                                type: 'save::start'
                            })
                            const req = await clientApiReq.secured.projects[':projectId'].update.$put({
                                param: {
                                    projectId: project.id
                                },
                                json: {
                                    request: {
                                        method: state.request.method,
                                        url: state.request.url,
                                    },
                                    schema: JSON.parse(state.schema.value) as any
                                }
                            })
                            const resp = await req.json();
                            console.log(resp)
                        }}>
                            Save
                        </Button>
                    </div>
                </footer>
            </main>
        </div>
    )
}