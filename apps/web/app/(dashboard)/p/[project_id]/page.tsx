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
import { CurlGen } from './CurlGen'

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
    const stats = await statsReq.json();

    return (
        <main className="grid flex-1 items-start p-4 grid-cols-1 sm:grid-cols-2 gap-2">

            <div className='grid grid-cols-2 gap-5 col-span-2'>
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
            </div>

            <Card>
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

            <Card>
                <CardHeader>
                    <CardTitle>
                        How to get the data
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <CurlGen
                        project_id={project_id}
                    />
                </CardContent>
            </Card>
        </main>
    )
}
