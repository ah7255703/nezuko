'use client'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Field, Form } from "@/components/ui/form"
import { clientApiReq } from "@/client/client-req"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function RegisterPage() {
    const form = useForm({
        resolver: zodResolver(z.object({
            name: z.string().min(2, "Name is required"),
            email: z.string().email("Invalid email address"),
            password: z.string().min(8, "Password must be at least 8 characters"),
        }))
    });
    const router = useRouter()
    return (
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="contents" onSubmit={form.handleSubmit(async (data) => {
                        const req = await clientApiReq.credentials.register.$post({
                            json: {
                                name: data.name,
                                email: data.email,
                                password: data.password,
                            }
                        })
                        if (req.ok) {
                            let resp = await req.json();
                            toast.success("Account created");
                            router.push("/auth")
                        } else {
                            toast.error("Failed to create account")
                        }

                    })}>
                        <div className="grid gap-4">
                            <Field
                                control={form.control}
                                name="name"
                                label="Name"
                                render={(f) => <Input {...f} type="text" />}
                            />
                            <Field
                                control={form.control}
                                name="email"
                                label="Email"
                                render={(f) => <Input {...f} type='email' />}
                            />
                            <Field
                                control={form.control}
                                name="password"
                                label="Password"
                                render={(f) => <Input {...f} type='password' />}
                            />
                            <Button type="submit" className="w-full">
                                Create an account
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/auth" className="underline">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </Form>

            </CardContent>
        </Card>
    )
}
