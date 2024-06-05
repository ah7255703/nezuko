import AutoForm from "@/components/auto-form";
import { z } from "zod";
import { useProject } from "../[project_id]/ProjectProvider";

export function ProjectSettingsPenel() {
    const { project } = useProject()
    return (
        <div className="relative h-full content-between w-full items-start border rounded-lg">
            <legend className="ml-1.5 bg-background w-fit -mt-2.5 px-1 text-sm font-medium">Settings</legend>
            <div className="p-4">
                <AutoForm
                    values={{
                        active: project?.data?.status === 'active',
                    }}
                    formSchema={z.object({
                        active: z.boolean().optional(),
                        headers: z.array(
                            z.object({
                                key: z.string().min(1),
                                value: z.string().min(1),
                            })
                        ),
                    })}
                />
            </div>
        </div>
    )
}
