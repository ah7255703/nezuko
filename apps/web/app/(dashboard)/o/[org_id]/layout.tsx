import Link from "next/link"
import {
    HomeIcon,
    SettingsIcon,
} from "lucide-react"
import { NavLink } from "@/app/_components/NavLink"

export default function OrgLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: {
        org_id: string
    }
}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/">
                            <span className="font-bold text-lg">
                                Nezoku
                            </span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <NavLink href={`/o/${params.org_id}`}
                                activeClassName="text-primary"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <HomeIcon className="h-4 w-4" />
                                Projects
                            </NavLink>
                            <NavLink href={`/o/${params.org_id}/settings`}
                                activeClassName="text-primary"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <SettingsIcon className="h-4 w-4" />
                                Settings
                            </NavLink>

                        </nav>
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}
