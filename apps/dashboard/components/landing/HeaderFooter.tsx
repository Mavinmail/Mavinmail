"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import mavinlogo from "@/public/mavinlogo.png"
import mavinlogodark from "@/public/mavin-logo-dark.png"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border bg-background"
    >
      <div className="relative flex items-center justify-between h-full max-w-[1200px] mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={mavinlogo} alt="MavinMail" className="w-7 h-7 rounded-md hidden dark:block" width={28} height={28} />
            <Image src={mavinlogodark} alt="MavinMail" className="h-7 w-auto object-contain block dark:hidden" width={120} height={28} />
            <span className="text-[15px] font-semibold text-foreground tracking-[-0.02em]">
              MavinMail
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </Link>
          <Link href="#pricing" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-5">
          <ModeToggle />
          <Link href="/login" className="hidden md:block text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link href="/signup">
            <button className="h-8 px-4 rounded-md bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}

export function SiteFooter() {
  const columns = [
    {
      title: "Features",
      links: [
        { label: "Summarization", href: "#features" },
        { label: "Smart Reply", href: "#features" },
        { label: "Ask Your Inbox", href: "#features" },
        { label: "Automation", href: "#features" },
      ],
    },
    {
      title: "Product",
      links: [
        { label: "Pricing", href: "#pricing" },
        { label: "Documentation", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Support", href: "#" },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src={mavinlogo} alt="MavinMail" className="w-6 h-6 rounded-md hidden dark:block" width={24} height={24} />
              <Image src={mavinlogodark} alt="MavinMail" className="h-8 w-auto object-contain block dark:hidden -ml-1" width={120} height={32} />
              <span className="text-sm font-semibold text-foreground">MavinMail</span>
            </div>
            <p className="text-[13px] text-zinc-600 leading-relaxed">
              Run your inbox.<br />Not the other way around.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-4">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-zinc-700">
            © 2026 MavinMail. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
