'use client';
import { useDialoger } from '@/app/_data-providers/dialoger';
import { clientApiReq } from '@/client/client-req';
import AutoForm, { AutoFormSubmit } from '@/components/auto-form';
import { Button } from '@/components/ui/button';
import React from 'react'
import { toast } from 'sonner';
import { z } from 'zod';
import { useOrgData } from '../_providers/OrgDataProvider';


const schema = z.object({
    title: z.string(),
})

export function CreateProject() {
    const { dialoger } = useDialoger();
    const org = useOrgData()
    return (
        <Button onClick={() => {
            dialoger.openDialog({
                title: 'Create Project',
                withoutFooter: true,
                content: (d, dialog) => <>
                    <AutoForm formSchema={schema} onSubmit={async (data) => {
                        const req = await clientApiReq.secured.projects[':orgId'].create.$post({
                            param: {
                                orgId: org.data.id,
                            },
                            json: {
                                title: data.title
                            }
                        })
                        if (req.ok) {
                            const resp = await req.json();
                            if (resp.id) {
                                d.closeDialog(dialog.id);
                                toast.success('Project created');
                            }
                        } else {
                            toast.error('Failed to create project')
                        }
                    }}>
                        <AutoFormSubmit>Create</AutoFormSubmit>
                    </AutoForm>
                </>
            })
        }}>
            Create Project
        </Button>
    )
}
