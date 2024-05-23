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


function page() {
    return (
        <div>
            <Header
                title='Settings'
            />
            <main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div
                    className="flex-1 rounded-xl border border-dashed shadow-sm p-4">
                    <div className='max-w-screen-md w-full'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Name</CardTitle>
                                <CardDescription>
                                    Used to identify your store in the marketplace.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <Input placeholder="Store Name" />
                                </form>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button>Save</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default page