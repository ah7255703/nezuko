import React from 'react'
import { ProjectProvider } from './ProjectProvider'

type Props = {
    children: React.ReactNode
}

export default function ProjectLayout({ children }: Props) {
    return (
        <ProjectProvider>{children}</ProjectProvider>
    )
}
