'use client';
import { clientApiReq } from '@/client/client-req';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import _, { parseInt } from 'lodash';
import React from 'react'
import useSWR from 'swr';

type Props = {
    projectId: string
}
function humanReadableBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
export function ProjectStats({ projectId }: Props) {
    const stats = useSWR(`/${projectId}/stats`, async () => {
        const statsReq = await clientApiReq.secured.projects[':projectId'].stats.$get({
            param: {
                projectId,
            }

        })
        const stats = await statsReq.json();
        return stats;
    })

    return (
        <>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-4xl">
                        {
                            stats.isLoading ? <Skeleton className='w-full h-8' /> : stats.data?.apiCallsCount
                        }
                    </CardTitle>
                    <CardDescription>
                        Total Processing Count <b>(Does not include the cache retrival)</b>
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-4xl">
                        {
                            stats.isLoading ? <Skeleton className='w-full h-8' /> : stats.data?.storedResponsesCount
                        }
                    </CardTitle>
                    <CardDescription>
                        Stored Responses
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-4xl">
                        {
                            stats.isLoading ? <Skeleton className='w-full h-8' /> : humanReadableBytes(_.toNumber(stats.data?.storedResponsesDbUsage))
                        }
                    </CardTitle>
                    <CardDescription>
                        Database Usage
                    </CardDescription>
                </CardHeader>
            </Card>
        </>
    )
}
