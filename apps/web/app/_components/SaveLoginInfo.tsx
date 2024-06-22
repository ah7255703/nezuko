'use client';
import { useCallback } from "react";
import { useAppConfig } from "../_data-providers/appConfig";
import { useUser } from "../_data-providers/UserProvider";
import { useDialoger } from "../_data-providers/dialoger";
import { useOnMount } from "../_hooks/useOnMount";

type SavedProfile = {
    name: string;
    email: string;
    image: string | null;
}

export function useGetSavedProfile() {
    const { get } = useAppConfig();
    const savedProfile = get<SavedProfile>("savedProfile");
    return savedProfile;
}

export function useSaveLoginInfo() {
    const { set } = useAppConfig();
    const { user } = useUser();
    const savedProfile = useGetSavedProfile();

    function saveProfile() {
        if (!user) {
            return;
        }
        const profile = {
            name: user.name,
            email: user.email,
            image: user.image,
        }
        set("savedProfile", profile);
    }

    return {
        savedProfile,
        saveProfile
    }
}

export function SaveLoginInfo() {
    const { savedProfile, saveProfile } = useSaveLoginInfo();
    const { dialoger } = useDialoger();

    useOnMount(() => {
        if (savedProfile) return;
        dialoger.openDialog({
            title: "Save Login Info",
            descption: "You can save your login info to make it easier to sign in next time.",
            onConfirm(dialoger, dialog) {
                saveProfile();
                dialoger.closeDialog(dialog.id);
            },
        })
    })
    return null;
}