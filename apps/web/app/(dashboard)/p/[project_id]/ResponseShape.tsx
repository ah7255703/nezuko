"use client";
import React from "react";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import { basicDark } from "@uiw/codemirror-theme-basic";
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
        if (req.ok) {
            return req.json()
        } else {
            return []
        }
    });

    const first = responsesJson.data?.at(0);

    return <div className='overflow-auto'>
        <Tabs defaultValue="json-schema">
            <TabsList className="space-x-2">
                <TabsTrigger value="json-schema">
                    JSON Schema
                </TabsTrigger>
                <TabsTrigger value="ts-types">Typescript interface</TabsTrigger>
            </TabsList>
            <TabsContent value="json-schema">
                <CodeMirror
                    className='text-base rounded-lg overflow-hidden'
                    readOnly
                    value={JSON.stringify(first?.responseShape, null, 2)}
                    height='100%'
                    extensions={[basicDark, basicSetup({
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
                    value={first?.responseTsInterface ?? ""}
                    height='100%'
                    extensions={[basicDark, basicSetup({
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
        </Tabs>

    </div>

}