'use client';
import Link from "next/link"
import {
  CircleUser,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "../actions/auth"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AutoForm, { AutoFormSubmit } from "@/components/auto-form";
import * as z from "zod";
import { clientApiReq } from "@/client/client-req";
import useSWR from "swr";
import { Card, CardHeader } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
})

export default function DashboardIndex() {
  const router = useRouter();
  const orgs = useSWR("orgs", async () => (await clientApiReq.secured.org.getAll.$get()).json())
  return (
    <div className="flex flex-col size-full">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">
              Nezoku
            </span>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => {
              const resp = await logout();
              if (resp.data?.success) {
                router.replace("/auth")
              }
            }}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold md:text-2xl">
            Your Organizations
          </h1>
          <div>
            <Popover>
              <PopoverContent>
                <AutoForm
                  onSubmit={async (data) => {
                    const req = await clientApiReq.secured.org.create.$post({
                      json: {
                        name: data.name
                      }
                    })
                    console.log(await req.json())
                  }}
                  formSchema={formSchema}
                >
                  <AutoFormSubmit>Send now</AutoFormSubmit>
                </AutoForm>
              </PopoverContent>
              <PopoverTrigger asChild>
                <Button className="mt-4">Create New Org</Button>
              </PopoverTrigger>
            </Popover>
          </div>
        </div>
        <div
          className="flex-1 rounded-lg border border-dashed shadow-sm"
        >
          {
            (orgs.data && orgs.data.length > 0) ?
              <div className="grid grid-cols-3 gap-3 p-3">
                {
                  orgs.data?.map((org, i) => {
                    return <div key={i} className="border rounded-lg">
                      <div className="w-full aspect-square h-40 bg-secondary" />
                      <Link href={`/o/${org.id}`} className="p-3 inline-block">
                        {org.name}
                      </Link>
                    </div>
                  })
                }
              </div>
              :
              orgs.isLoading ? <></> :
                <div className="size-full flex-center">
                  <div data-empty className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      You have no products
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You can start selling as soon as you add a product.
                    </p>
                    <Popover>
                      <PopoverContent>
                        <AutoForm
                          onSubmit={async (data) => {
                            const req = await clientApiReq.secured.org.create.$post({
                              json: {
                                name: data.name
                              }
                            })
                            console.log(await req.json())
                          }}
                          formSchema={formSchema}
                        >
                          <AutoFormSubmit>Send now</AutoFormSubmit>
                        </AutoForm>
                      </PopoverContent>
                      <PopoverTrigger asChild>
                        <Button className="mt-4">Create New Org</Button>
                      </PopoverTrigger>
                    </Popover>
                  </div>
                </div>
          }
        </div>
      </main >
    </div >
  )
}
