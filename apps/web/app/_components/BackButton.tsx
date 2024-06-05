'use client';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
    const router = useRouter();
    return <Button size='xicon' onClick={router.back} variant='outline'>
        <span className="sr-only">Back</span>
        <ChevronLeft className="size-4" />
    </Button>
}