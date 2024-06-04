'use client';
import AutoForm from '@/components/auto-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { fetchToCurl } from 'fetch-to-curl'
import { ClipboardCopy } from 'lucide-react';
import React, { useState } from 'react'
import { z } from 'zod';

const settingsSchema = z.object({
    projectId: z.string(),
    noCache: z.boolean().nullable(),
    token: z.string().nullable(),
})

export function CurlGen({ project_id }: { project_id: string }) {

    const [
        curl,
        setCurl
    ] = useState<string>('')

    return (
        <>
            <div>
                <AutoForm
                    formSchema={settingsSchema}
                    values={{
                        projectId: project_id,
                        noCache: false,
                        token: ""
                    }}
                    onParsedValuesChange={
                        (values) => {
                            let c = fetchToCurl(`http://localhost:3001/project/${values.projectId}`, {
                                method: "POST",
                                headers: {
                                    'X-No-Cache': values.noCache ? 'true' : 'false',
                                    "X-Token": values.token ?? ""
                                }
                            })
                            setCurl(c)
                        }
                    }
                />
            </div>
            <div className='space-y-1'>
                <Label>
                    Curl
                </Label>
                <div className='relative'>
                    <Button variant="outline" size='xicon'
                        className='absolute right-2 top-2'
                        onClick={() => {
                            navigator.clipboard.writeText(curl)
                        }}>
                        <ClipboardCopy className='size-4' />
                    </Button>
                    <Textarea value={curl} minLength={6} readOnly className='font-mono select-all text-base' />
                </div>
            </div>
        </>

    )
}
