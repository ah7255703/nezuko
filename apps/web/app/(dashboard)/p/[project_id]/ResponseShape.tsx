"use client";
import React from "react";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import CodeMirror from "@uiw/react-codemirror";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { clientApiReq } from "@/client/client-req";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResponseShape() {
    const { project_id } = useParams()
    const responsesJson = useSWR(`${project_id}/responses/json`, async () => {
        if (!project_id) return
        const req = await clientApiReq.secured.projects[":projectId"].responses.$get({
            param: {
                projectId: project_id as string
            },
        })
        let response = (await req.json()).at(0)
        if (!response) return null
        return {
            responseShape: JSON.stringify(JSON.parse(response.responseShape ?? ""), null, 2),
            responseTsInterface: response.responseTsInterface
        }
    });


    return <div className='overflow-hidden'>
        <Tabs defaultValue="json-schema">
            <TabsList className="space-x-2">
                <TabsTrigger value="json-schema">
                    JSON Schema
                </TabsTrigger>
                <TabsTrigger value="ts-types">Typescript interface</TabsTrigger>
            </TabsList>
            <div className="w-full max-h-60 overflow-auto">
                <TabsContent value="json-schema">
                    <CodeMirror
                        className='text-base rounded-lg overflow-hidden'
                        readOnly
                        value={responsesJson.data?.responseShape ?? ""}
                        height='100%'
                        extensions={[basicSetup({
                            lineNumbers: false,
                            autocompletion: true,
                            closeBrackets: true,
                            foldGutter: false,
                        }), json()]}
                        theme="dark"
                    />
                </TabsContent>
                <TabsContent value="ts-types">
                    <CodeMirror
                        className='first:size-full text-base rounded-lg overflow-hidden'
                        readOnly
                        value={responsesJson.data?.responseTsInterface ?? ""}
                        height='100%'
                        extensions={[basicSetup({
                            lineNumbers: false,
                            autocompletion: true,
                            closeBrackets: true,
                            foldGutter: false,
                        }), javascript({
                            typescript: true
                        })]}
                        theme="dark"
                    />
                </TabsContent>
            </div>
        </Tabs>

    </div>

}