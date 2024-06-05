import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { BellIcon, CircleUserIcon } from "lucide-react";
import { ComponentProps, ElementRef, forwardRef, ReactNode } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BackButton } from "./BackButton";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Notifications } from "./Notifications";

export const HeaderShell = forwardRef<ElementRef<"header">, ComponentProps<"header">
>(({ className, ...props }, _ref) => {
    return <header ref={_ref} className={cn("flex h-14 shrink-0 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6", className)} {...props} />
});

type Props = {
    title?: string;
    end?: ReactNode;
    withBack?: boolean;
}
export function Header({ title, end, withBack = true }: Props) {

    return <HeaderShell>
        <div className='flex items-center justify-between gap-2 w-full'>
            <div className='flex-1 flex items-center gap-2'>
                {
                    withBack && <BackButton />
                }
                {
                    title ? <h1 className='text-lg font-semibold md:text-2xl'>{title}</h1> : null
                }
            </div>
            <div className='flex items-center gap-2'>
                {end}

                <Popover>
                    <PopoverContent className="h-64" align="end">
                        <Notifications />
                    </PopoverContent>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <BellIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </PopoverTrigger>
                </Popover>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUserIcon className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </HeaderShell>
}