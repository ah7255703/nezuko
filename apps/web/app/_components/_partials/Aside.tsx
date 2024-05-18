import Link from 'next/link'
import React from 'react'
import { HomeIcon, SettingsIcon } from "lucide-react";
import { NavLink } from '@ui/NavLink';
import { UserCard } from './UserCard';

export function PrivateAside() {
    return (
        <div className="size-full border-e flex flex-col">
            <div className="p-4 flex items-center justify-start h-14 border-b">
                <Link href="/">
                    <h1 className="text-xl font-bold">
                        Dentofolio
                    </h1>
                </Link>
            </div>
            <div className='flex flex-col gap-4 w-full p-3 flex-1'>
                <span className='uppercase text-sm font-semibold'>navigation</span>
                <nav className="flex flex-col items-start gap-2">
                    <NavLink href="/" className='group w-full'>
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 group-data-[active=true]:bg-muted/40">
                            <HomeIcon className="h-6 w-6" />
                            <span>
                                Home
                            </span>
                        </div>
                    </NavLink>
                    <NavLink href="/profile/settings" className='group w-full'>
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 group-data-[active=true]:bg-muted/40">
                            <SettingsIcon className="h-6 w-6" />
                            <span>
                                Settings
                            </span>
                        </div>
                    </NavLink>
                </nav>
            </div>
            <div className='p-3'>
                <UserCard />
            </div>
        </div>
    )
}
