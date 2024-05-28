'use client';
import React from 'react'
import { Header } from '@/app/_components/HeaderShell'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useDialoger } from '@/app/_data-providers/dialoger';
import { clientApiReq } from '@/client/client-req';
import { useOrgData } from '../../_providers/OrgDataProvider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function page() {
    const { dialoger } = useDialoger();
    const org = useOrgData()
    const router = useRouter()
    return (
        <div>
            <Header
                title='Settings'
            />
            <main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div
                    className="flex-1 rounded-xl border border-dashed shadow-sm p-4">
                    <div className='max-w-screen-md w-full  grid grid-cols-1 gap-5'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Name</CardTitle>
                                <CardDescription>
                                    Used to identify your store in the marketplace.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <Input defaultValue={org.data.name} />
                                </form>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button className='ms-auto'>Save</Button>
                            </CardFooter>
                        </Card>
                        <Card className='border-destructive'>
                            <CardHeader>
                                <CardTitle>Delete organization</CardTitle>
                                <CardDescription>
                                    This will permanently delete your organization.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="border-t px-6 py-4 flex items-center justify-end">
                                <Button onClick={() => {
                                    dialoger.openDialog({
                                        title: "Delete organization",
                                        descption: "Are you sure you want to delete this organization? This action cannot be undone.",
                                        async onConfirm(dialoger, dialog) {
                                            const req = await clientApiReq.secured.org[':id'].$delete({
                                                param: {
                                                    id: org.data?.id
                                                }
                                            })
                                            if (req.ok) {
                                                dialoger.closeDialog(dialog.id);
                                                toast.success("Organization deleted")
                                                router.replace('/')
                                            } else {
                                                toast.error("Failed to delete organization")
                                            }
                                        },
                                    })
                                }} variant='destructive'>Delete</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default page