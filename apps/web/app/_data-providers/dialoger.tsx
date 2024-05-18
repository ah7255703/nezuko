"use client";
import { ReactNode, useMemo } from "react";
import { Store, useStore } from "@/lib/store";
import _ from "lodash";
import { createSafeContext } from "@/utils/create-safe-context";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@df/ui/alert-dialog";
import { Button } from "@df/ui/button";

type Dialog = {
    id: string
    open: boolean
    title: string
    descption?: string
    content?: ReactNode
    body?: ReactNode // replaces the whole content
    cancelText?: string
    confirmText?: string
    onCconfirm?: (dialoger: DialogStore, dialog: Dialog) => void
    onCancel?: (dialoger: DialogStore, dialog: Dialog) => void
}

type DialogOptions = {
    onClose?: (id: string) => void
}

class DialogStore extends Store<{
    dialogs: Dialog[];
}, DialogOptions> {
    closeDialog = (id: string) => {
        this.setValue((state) => {
            const dialogs = state.dialogs.filter((dialog) => dialog.id !== id)
            return { dialogs }
        })
    }
    private _openDialog = (dialog: Dialog) => {
        this.setValue((state) => {
            const dialogs = [...state.dialogs, dialog]
            return { dialogs }
        })
    }
    openDialog = (dialog: Omit<Dialog, "id" | "open">) => {
        const id = _.uniqueId()
        this._openDialog({
            id,
            ...dialog,
            open: true
        })
    }

}
const [
    DialogerInstanceSafeProvider,
    useDialoger,
] = createSafeContext<{
    dialoger: DialogStore;
}>("Dialoger instance");

export function DialogerProvider({ children }: { children: ReactNode }) {
    const dialoger = useMemo(() => new DialogStore({
        dialogs: [],
    }), [])
    return <DialogerInstanceSafeProvider value={{
        dialoger
    }}>
        {children}
    </DialogerInstanceSafeProvider>
}
export {
    useDialoger,
}
export function Dialoger(
) {
    const { dialoger } = useDialoger()
    const { dialogs } = useStore(dialoger)
    return <>
        {
            dialogs.map((dialog, i) => {
                return <AlertDialog key={i} open={dialog.open} onOpenChange={(open) => {
                    if (dialog.onCconfirm || dialog.onCancel) {
                        return;
                    }
                    if (open) {
                        dialoger.openDialog(dialog)
                    } else {
                        dialoger.closeDialog(dialog.id)
                    }
                }}>
                    <AlertDialogContent forceMount>
                        {
                            dialog.body ? dialog.body : <>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
                                    <AlertDialogDescription>{dialog.descption}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="w-full">
                                    {dialog.content}
                                </div>
                                <AlertDialogFooter className="flex items-center gap-2">
                                    <AlertDialogCancel
                                        onClick={() => {
                                            if (dialog.onCancel) {
                                                dialog.onCancel(dialoger, dialog)
                                            }
                                        }}
                                    >{dialog.cancelText ?? "Cancel"}</AlertDialogCancel>
                                    <AlertDialogAction asChild
                                        onClick={() => {
                                            if (dialog.onCconfirm) {
                                                dialog.onCconfirm(dialoger, dialog)
                                            }
                                        }}
                                    >
                                        <Button>
                                            {dialog.confirmText ?? "OK"}
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </>
                        }
                    </AlertDialogContent>
                </AlertDialog>
            })
        }
    </>
}