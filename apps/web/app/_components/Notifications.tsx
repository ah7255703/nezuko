"use client";
import { EmptyState } from "@/components/domain/EmptyState";
import { useEffect, useState } from "react";

export function Notifications() {
    return <div className="size-full">
        <EmptyState>
            No notifications yet
        </EmptyState>
    </div>
}