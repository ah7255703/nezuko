import React, { Suspense } from 'react'
import { getServerSession } from '../auth/getServerSession'
import { redirect } from 'next/navigation';
import { UserProvider } from "../_data-providers/UserProvider";
import { SocketProvider } from '../_data-providers/SocketProvider';
import { SaveLoginInfo } from '../_components/SaveLoginInfo';

type Props = {
    children: React.ReactNode
}

export default async function DashboardLayout({ children }: Props) {
    const session = await getServerSession();
    if (!session.isAuthenticated) {
        redirect('/auth')
    }
    return (
        <UserProvider>
            <SocketProvider>
                {children}
                <Suspense>
                    <SaveLoginInfo />
                </Suspense>
            </SocketProvider>
        </UserProvider>
    )
}
