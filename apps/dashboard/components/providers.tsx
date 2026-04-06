"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"

export function Providers({ children, ...props }: any) {
    return (
        <SessionProvider>
            <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                forcedTheme="dark"
                disableTransitionOnChange
                {...props}
            >
                {children}
            </NextThemesProvider>
        </SessionProvider>
    )
}
