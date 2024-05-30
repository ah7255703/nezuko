'use client';
import { Header } from "@/app/_components/HeaderShell";
import { clientApiReq } from "@/client/client-req";
import { Button } from "@/components/ui/button";
import { createSafeContext } from "@/utils/create-safe-context";
import { InferResponseType } from "hono";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR, { type SWRResponse } from "swr";

type ProjectRespType = NonNullable<InferResponseType<typeof clientApiReq.secured.projects[':projectId']['$get']>>

const [SafeProjectProvider, useProject] = createSafeContext<{
    project: SWRResponse<ProjectRespType | null, any, any>
}>("ProjectProvider instance");

function ProjectProvider({ children }: { children: React.ReactNode }) {
    const { project_id } = useParams()

    const project = useSWR(project_id, async () => {
        if (!project_id) return null;
        const req = await clientApiReq.secured.projects[':projectId'].$get({
            param: {
                projectId: project_id as string
            }
        })
        return req.json()
    });
    if (!project.data) {
        return
    }
    return (
        <SafeProjectProvider value={{ project }}>
            <div className='flex size-full flex-col'>
                <Header
                    end={<Button size='sm' asChild>
                        <Link href={`/p/${project_id}/studio`}>
                            Configure
                        </Link>
                    </Button>}
                    title={project.data.name}
                />
                <main className="flex-1 w-full">
                    {children}
                </main>
            </div>
        </SafeProjectProvider>
    )
}

export {
    ProjectProvider,
    useProject
}