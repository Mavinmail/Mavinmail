"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }

    return (
        <AuthLayout
            heading="Welcome back"
            subheading="Enter your email to sign in to your account"
            quote="“Success is not the key to happiness. Happiness is the key to success.”"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors duration-300" />
                        <Input
                            type="email"
                            placeholder="you@mavin.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] focus:bg-white/10 transition-all duration-300 rounded-none border-t-0 border-x-0 border-b focus:border-b-2"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors duration-300" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] focus:bg-white/10 transition-all duration-300 rounded-none border-t-0 border-x-0 border-b focus:border-b-2"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#22d3ee] hover:bg-[#1ebbd3] text-black font-bold text-base rounded-none transition-all active:scale-[0.98] mt-2 relative overflow-hidden"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "SIGN IN"
                    )}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-white/40">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-none transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                        Google
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-none transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        GitHub
                    </Button>
                </div>

                <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="font-semibold text-[#22d3ee] hover:text-[#1ebbd3] underline-offset-4 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    )
}
