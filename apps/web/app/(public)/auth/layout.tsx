import { getServerSession } from '@/app/auth/getServerSession';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    children: React.ReactNode
}

export default async function AuthLayout({ children }: Props) {
    const session = await getServerSession();
    if (session.isAuthenticated) {
        redirect('/')
    }
    return (
        <div className='size-full flex-center'>{children}</div>
    )
}
