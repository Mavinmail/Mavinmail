import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import mavinlogo from '@/public/mavinlogo.png'

interface AuthLayoutProps {
    children: React.ReactNode
    heading: string
    subheading: string
    quote?: string
}

export function AuthLayout({ children, heading, subheading, quote }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-[#0C0C0C] text-white font-sans">
            <div className="flex min-h-screen max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
                {/* Left Side: Brand panel */}
                <div className="hidden lg:flex w-1/2 flex-col justify-between py-12 pr-16">
                    {/* Top Brand */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image src={mavinlogo} alt="MavinMail" className="w-7 h-7 rounded-md" width={28} height={28} />
                        <span className="text-[15px] font-semibold text-white tracking-[-0.02em]">
                            MavinMail
                        </span>
                    </Link>

                    {/* Center content */}
                    <div className="max-w-sm">
                        <blockquote className="text-[28px] font-semibold leading-tight text-white tracking-[-0.02em]">
                            {quote || "Your inbox, intelligently handled."}
                        </blockquote>
                        <p className="mt-4 text-[15px] text-zinc-500 leading-relaxed">
                            MavinMail reads, summarizes, and drafts replies so you can focus on what matters.
                        </p>
                    </div>

                    {/* Bottom */}
                    <p className="text-[12px] text-zinc-700">
                        &copy; 2026 MavinMail. All rights reserved.
                    </p>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-white/[0.06] my-12" />

                {/* Right Side: Form Container */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 lg:pl-16">
                    {/* Mobile Brand */}
                    <div className="lg:hidden self-start flex items-center gap-2.5 mb-12">
                        <Link href="/" className="flex items-center gap-2.5">
                            <Image src={mavinlogo} alt="MavinMail" className="w-7 h-7 rounded-md" width={28} height={28} />
                            <span className="text-[15px] font-semibold text-white">MavinMail</span>
                        </Link>
                    </div>

                    <div className="w-full max-w-[380px] space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-white">
                                {heading}
                            </h1>
                            <p className="text-[14px] text-zinc-500">
                                {subheading}
                            </p>
                        </div>

                        {/* Form content */}
                        <div className="space-y-6">
                            {children}
                        </div>

                        <p className="text-[12px] text-zinc-600 text-center">
                            Your data stays private. Always.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
