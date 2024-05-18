import { ShipWheelIcon } from "lucide-react";

export function EmptyState({ children }: { children: React.ReactNode }) {
    return (
        <div className="size-full flex flex-col items-center justify-center">
            <div>
                <ShipWheelIcon className="size-20" />
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}