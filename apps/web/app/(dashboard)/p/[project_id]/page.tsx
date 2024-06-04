import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ResponseShape } from './ResponseShape'
import { serverApiReq } from '@/client/server-req'

export default async function ProjectIndexPage({
    params: { project_id }
}: {
    params: {
        project_id: string
    }
}) {
    
    const statsReq = await serverApiReq.secured.projects[':projectId'].api_stats.$get({
        param: {
            projectId: project_id,
        }

    })
    const stats = await statsReq.json()
    return (
        <main className="grid flex-1 items-start p-4 grid-cols-2 gap-2">
            <Card className='col-span-2'>
                <CardHeader>
                    <CardTitle>API Calls</CardTitle>
                    <CardDescription>
                        Monitor your API calls and usage
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-3 gap-5'>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Total API Calls
                            </CardDescription>
                            <CardTitle className="text-4xl">
                                {stats.count}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </CardContent>
            </Card>

            <Card className='col-span-2'>
                <CardHeader>
                    <CardTitle>
                        Response Shape
                    </CardTitle>
                    <CardDescription>
                        The expected response shape based on the previous responses.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponseShape />
                </CardContent>
            </Card>
        </main>
    )
}
