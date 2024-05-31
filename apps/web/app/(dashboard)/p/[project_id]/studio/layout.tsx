import React from 'react'
import { StudioProvider } from './StudioProvider'

type Props = {
    children: React.ReactNode
}

function StudioLayout({ children }: Props) {
    return (
        <StudioProvider>
            {children}
        </StudioProvider>
    )
}

export default StudioLayout