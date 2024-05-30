import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProjectIndexPage() {
    return (
        <main className="grid flex-1 items-start p-4">
            <Card>
                <CardHeader>
                    <CardTitle>API Calls</CardTitle>
                    <CardDescription>
                        Monitor your API calls and usage
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-3 gap-5'>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Total API Calls
                            </CardDescription>
                            <CardTitle className="text-4xl">
                                10,000
                            </CardTitle>
                        </CardHeader>
                        <CardFooter>
                            <Progress value={25} aria-label="25% increase" />
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Total API Calls
                            </CardDescription>
                            <CardTitle className="text-4xl">
                                10,000
                            </CardTitle>
                        </CardHeader>
                        <CardFooter>
                            <Progress value={25} aria-label="25% increase" />
                        </CardFooter>
                    </Card>
                </CardContent>
            </Card>
        </main>
    )
}
