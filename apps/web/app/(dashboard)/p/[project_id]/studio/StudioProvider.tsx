'use client';
import { createSafeContext } from "@/utils/create-safe-context";
import { produce } from "immer";
import React from "react";
import { useProject } from "../ProjectProvider";

interface State {
    request: {
        method: string
        url: string
    }
    schema: {
        value: string;
    }
    state: {
        save: "loading" | "success" | "error" | "idle",
        lastResponse: string | null,
    }
}

type Action = {
    type: 'setRequest'
    payload: Partial<State['request']>
} | {
    type: 'save::start'
} | {
    type: 'save::success'
} | {
    type: 'save::error'
} | {
    type: 'setSchema'
    payload: Partial<State['schema']>
} | {
    type: 'setLastResponse'
    payload: string
}

function reducer(state: State, action: Action) {
    return produce(state, draft => {
        switch (action.type) {
            case 'setRequest':
                draft.request = { ...draft.request, ...action.payload }
                break;
            case 'save::start':
                draft.state.save = 'loading'
                break;
            case 'save::success':
                draft.state.save = 'success'
                break;
            case 'save::error':
                draft.state.save = 'error'
                break;
            case 'setSchema':
                draft.schema = { ...draft.schema, ...action.payload }
                break;
            case "setLastResponse":
                draft.state.lastResponse = action.payload
                break;
        }
    })
}

const [SafeStudioProvider, useStudio] = createSafeContext<{
    state: State
    dispatch: React.Dispatch<Action>
}>("ProjectProvider instance");

function StudioProvider({ children }: { children: React.ReactNode }) {
    const { project } = useProject();

    const [state, dispatch] = React.useReducer(reducer, {
        request: {
            method: project.data?.request.method || '',
            url: project.data?.request.url || ''
        },
        state: {
            save: "idle",
            lastResponse: null
        },
        schema: {
            value: JSON.stringify(project.data?.schema, null, 2)
        }
    })

    return (
        <SafeStudioProvider value={{
            state,
            dispatch
        }}>
            {children}
        </SafeStudioProvider>
    )
}

export {
    StudioProvider,
    useStudio
}