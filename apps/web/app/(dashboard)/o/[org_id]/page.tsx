import React from 'react'
import { Header } from '@/app/_components/HeaderShell'

function page() {
  return (
    <div>
      <Header
        title='Projects'
      />
      <main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div
          className="flex-1 rounded-lg border border-dashed shadow-sm">
        </div>
      </main>
    </div>
  )
}

export default page