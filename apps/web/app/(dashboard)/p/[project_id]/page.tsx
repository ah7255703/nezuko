import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ResponseShape } from './ResponseShape'
import { CurlGen } from './CurlGen'
import { ProjectStats } from './ProjectStats'

export default async function ProjectIndexPage({
    params: { project_id }
}: {
    params: {
        project_id: string
    }
}) {

    return (
        <main className="grid flex-1 items-start p-4 grid-cols-1 sm:grid-cols-2 gap-2">

            <div className='grid grid-cols-3 gap-5 col-span-2'>
                <ProjectStats
                    projectId={project_id}
                />
            </div>

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
