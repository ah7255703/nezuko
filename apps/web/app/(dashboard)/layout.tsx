import React from 'react'
import { getServerSession } from '../auth/getServerSession'
import { redirect } from 'next/navigation';
type Props = {
    children: React.ReactNode
}

export default async function DashboardLayout({ children }: Props) {
    const session = await getServerSession();
    if (!session.isAuthenticated) {
        redirect('/auth')
    }
    return (
        <>{children}</>
    )
}
