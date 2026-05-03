"use client"

import { motion } from "framer-motion"
import { FileText, Reply, LayoutGrid, Zap } from "lucide-react"

const features = [
  {
    icon: <FileText className="w-5 h-5 text-[#24D3EE]" />,
    title: "Summarization",
    description: "One-click thread summaries with key decisions, action items, and deadlines extracted automatically.",
  },
  {
    icon: <Reply className="w-5 h-5 text-[#24D3EE]" />,
    title: "Smart Replies",
    description: "Context-aware reply suggestions that match your tone and writing style. One click to send.",
  },
  {
    icon: <LayoutGrid className="w-5 h-5 text-[#24D3EE]" />,
    title: "Categorization",
    description: "Emails are automatically labeled and prioritized so the important ones surface first.",
  },
  {
    icon: <Zap className="w-5 h-5 text-[#24D3EE]" />,
    title: "Automation",
    description: "Build if-this-then-that workflows. Forward billing, auto-label, schedule morning digests.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-background dark:bg-[#0C0C0C] border-t border-border dark:border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <div className="max-w-xl mb-16">
          <p className="text-[11px] font-medium text-[#24D3EE] uppercase tracking-[0.15em] mb-3 font-mono">
            Features
          </p>
          <h2 className="text-[32px] font-bold text-foreground dark:text-white tracking-[-0.02em] leading-tight">
            Everything you need to run your inbox
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground dark:text-zinc-500 leading-relaxed">
            Summarization, replies, categorization, and automation — all connected in one system.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 gap-px bg-white/[0.04] rounded-lg overflow-hidden border border-border dark:border-white/[0.06]">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="bg-background dark:bg-[#0C0C0C] p-8 group hover:bg-card dark:bg-[#111111] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg border border-border dark:border-white/[0.06] bg-muted dark:bg-[#161616] flex items-center justify-center mb-5 group-hover:border-[#24D3EE]/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-[17px] font-semibold text-foreground dark:text-white mb-2 tracking-[-0.01em]">
                {feature.title}
              </h3>
              <p className="text-[14px] text-muted-foreground dark:text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
