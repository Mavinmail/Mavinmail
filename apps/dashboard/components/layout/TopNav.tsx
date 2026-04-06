"use client"

import { Book, HelpCircle, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileSidebar } from "./Sidebar"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

interface TopNavProps {
    activeView: string
    onViewChange: (view: string) => void
    navItems?: any[]
}

export function TopNav({ activeView, onViewChange, navItems }: TopNavProps) {
    const { data: session } = useSession()
    const viewName = activeView.charAt(0).toUpperCase() + activeView.slice(1).replace("-", " ")

    const getInitials = (name?: string | null) => {
        if (!name) return "U"
        const parts = name.trim().split(" ")
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const displayName = session?.user?.name || session?.user?.email?.split('@')[0] || "User"

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/[0.06] bg-[#0C0C0C] px-6">
            <MobileSidebar activeView={activeView} onViewChange={onViewChange} navItems={navItems} />

            <div className="flex flex-1 items-center gap-4">
                {/* Breadcrumb */}
                <div className="hidden md:flex items-center gap-2 text-[13px]">
                    <Link href="/dashboard" className="text-zinc-600 hover:text-white transition-colors">
                        Home
                    </Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-white font-medium">{viewName}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full h-8 bg-[#161616] border-white/[0.06] pl-9 text-[13px] text-white placeholder:text-zinc-600 rounded-md focus-visible:ring-[#24D3EE]/20 focus-visible:border-[#24D3EE]/30"
                    />
                </div>

                <button className="h-8 w-8 flex items-center justify-center rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-[#161616] transition-colors">
                    <Book className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-[#161616] transition-colors">
                    <HelpCircle className="h-4 w-4" />
                </button>

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-2 h-8 rounded-md hover:bg-[#161616] transition-colors">
                            <span className="hidden sm:inline-block text-[13px] font-medium text-zinc-400">{displayName}</span>
                            <Avatar className="h-6 w-6 rounded-md">
                                <AvatarImage src={session?.user?.image || "/avatars/01.png"} alt="@user" className="rounded-md object-cover" />
                                <AvatarFallback className="bg-[#161616] text-[#24D3EE] rounded-md font-medium text-[10px]">
                                    {getInitials(displayName)}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-52 bg-[#111111] border-white/[0.06] text-white" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-[13px] font-medium">{displayName}</p>
                                <p className="text-[11px] text-zinc-500">{session?.user?.email || "user@example.com"}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem className="text-[13px] text-zinc-400 focus:bg-[#161616] focus:text-white" onClick={() => onViewChange('profile')}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] text-zinc-400 focus:bg-[#161616] focus:text-white" onClick={() => onViewChange('settings')}>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem
                            className="text-[13px] text-red-400 focus:bg-[#161616] focus:text-red-400"
                            onClick={() => signOut({ callbackUrl: '/login' })}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
