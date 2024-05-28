import React from 'react'
import { Header } from '@/app/_components/HeaderShell'
import { serverApiReq } from '@/client/server-req'
import Link from 'next/link'
import { CreateProject } from '../_components/createProject'

async function page({
  params: {
    org_id
  }
}: {
  params: {
    org_id: string
  }
}) {
  const req = await serverApiReq.secured.projects[':orgId'].getAll.$get({ param: { orgId: org_id } });
  const projects = await req.json();

  return (
    <div className='flex flex-col'>
      <Header
        title='Projects'
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div
          className="flex-1 rounded-lg border border-dashed shadow-sm">
          {
            projects.length === 0 ? <div className='flex-center size-full'>
              <CreateProject />
            </div> : projects.map((p) => (
              <Link href={`/p/${p.id}`}>
                {p.name}
              </Link>
            ))
          }
        </div>
      </main>
    </div>
  )
}

export default page