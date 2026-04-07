"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

const typingText = "Summarize my last 20 emails"

function TypingInput() {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < typingText.length) {
        setDisplayed(typingText.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-xl mx-auto mt-12">
      <div className="relative flex items-center h-12 rounded-lg border border-white/[0.08] bg-[#161616] px-4">
        <span className="text-[15px] text-zinc-300 font-mono">
          {displayed}
        </span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-[2px] h-5 bg-[#24D3EE] ml-0.5"
        />
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute right-3"
          >
            <div className="h-7 px-3 rounded-md bg-[#24D3EE] flex items-center">
              <span className="text-[12px] font-semibold text-[#0C0C0C]">Run ↵</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 bg-[#0C0C0C]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/[0.06] bg-[#161616] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#24D3EE]" />
          <span className="text-[12px] text-zinc-400 font-medium">AI-powered email intelligence</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-white leading-[1.1] tracking-[-0.03em] max-w-3xl mx-auto"
        >
          Your inbox.<br />
          Handled by intelligence.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-[17px] text-zinc-500 leading-relaxed max-w-lg mx-auto"
        >
          Summarize, reply, prioritize, and automate your emails — instantly.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <Link href="/signup">
            <button className="h-10 px-6 rounded-md bg-white text-[#0C0C0C] text-[14px] font-medium hover:bg-zinc-200 transition-colors">
              Start your trial
            </button>
          </Link>
          <Link href="#how-it-works">
            <button className="h-10 px-6 rounded-md border border-white/[0.08] text-[14px] text-zinc-400 font-medium hover:text-white hover:border-white/[0.15] transition-colors">
              How it works
            </button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-[12px] text-zinc-600"
        >
          Free to start · No credit card required
        </motion.p>

        {/* Typing Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <TypingInput />
        </motion.div>
      </div>
    </section>
  )
}
