"use client";
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
import { useForm } from "react-hook-form";
import { Field, Form } from "@/components/ui/form";
import { loginUser } from "@/app/actions/auth";

export default function LoginPage() {
    const form = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    })
    async function onSubmit({ email, password }: {
        email: string,
        password: string
    }) {
        const result = await loginUser({ email, password });
        console.log(result)
    }
    return (
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <Field
                                control={form.control}
                                name='email'
                                required
                                render={(f) => <Input {...f} type='email' />}
                            />
                            <Field
                                control={form.control}
                                name='password'
                                required
                                render={(f) => <Input {...f} type='password' />}
                            />

                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <Button variant="outline" className="w-full">
                                Login with Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
