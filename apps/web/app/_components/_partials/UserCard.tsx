import { Avatar, AvatarFallback } from "@df/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@df/ui/dropdown-menu";
import Link from "next/link";

export function UserCard() {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className="w-full flex items-center p-2 hover:bg-muted/50 rounded-lg">
                <Avatar>
                    <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <span className="ml-2">John Doe</span>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[var(--radix-popper-anchor-width)]">
            <DropdownMenuLabel>ah@example.com</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}