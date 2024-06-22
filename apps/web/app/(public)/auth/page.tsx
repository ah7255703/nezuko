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
import { useGetSavedProfile } from "@/app/_components/SaveLoginInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LoginPage() {
    const savedProfile = useGetSavedProfile();
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
                {savedProfile && (
                    <div className="mb-3 ">
                        <span className="uppercase text-xs font-semibold mb-1 block">saved profile</span>
                        <div onClick={() => {
                        }} className="flex items-center p-2 rounded-lg bg-muted/20 gap-2">
                            <Avatar>
                                <AvatarImage src={savedProfile?.image || ''} />
                                <AvatarFallback>{savedProfile?.name.at(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-sm font-medium">{savedProfile?.name}</h2>
                        </div>
                    </div>
                )}
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

                            <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
                                Login
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
