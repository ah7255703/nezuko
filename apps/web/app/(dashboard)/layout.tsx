import React from 'react'
import { getServerSession } from '../auth/getServerSession'
import { redirect } from 'next/navigation';
import { UserProvider } from "../_data-providers/UserProvider";

type Props = {
    children: React.ReactNode
}

export default async function DashboardLayout({ children }: Props) {
    const session = await getServerSession();
    if (!session.isAuthenticated) {
        redirect('/auth')
    }
    return (
        <UserProvider>{children}</UserProvider>
    )
}
