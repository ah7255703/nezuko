import AutoForm from "@/components/auto-form";
import { z } from "zod";
import { useProject } from "../[project_id]/ProjectProvider";

export function ProjectSettingsPenel() {
    const { project } = useProject()
    return (
        <div className="relative content-between size-full items-start gap-6 border rounded-lg">
            <legend className="ml-1.5 bg-background w-fit -mt-2.5 px-1 text-sm font-medium">Settings</legend>
            <div className="p-4">
                <AutoForm
                    values={{
                        active: project?.data?.status === 'active',
                    }}
                    formSchema={z.object({
                        active: z.boolean().optional(),
                    })}
                />
            </div>
        </div>
    )
}
