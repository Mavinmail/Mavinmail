"use client"

import { motion } from "framer-motion"

const steps = [
  { num: "01", label: "Email received", sub: "New message lands in your inbox" },
  { num: "02", label: "AI reads context", sub: "Intent, tone, and entities extracted" },
  { num: "03", label: "Rules applied", sub: "Your automations and preferences run" },
  { num: "04", label: "Output generated", sub: "Summary, reply, or action delivered" },
]

export function FlowchartSection() {
  return (
    <section id="how-it-works" className="py-28 bg-[#0C0C0C] border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-[11px] font-medium text-[#24D3EE] uppercase tracking-[0.15em] mb-3 font-mono">
            How it works
          </p>
          <h2 className="text-[32px] font-bold text-white tracking-[-0.02em] leading-tight">
            From email to action in seconds
          </h2>
          <p className="mt-4 text-[15px] text-zinc-500 leading-relaxed">
            Every email is processed through an intelligent pipeline that understands context before acting.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-6 left-[28px] bottom-6 w-px bg-white/[0.06]" />

          <div className="space-y-0">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.12, duration: 0.4 }}
                className="relative flex items-start gap-6 py-6 group"
              >
                {/* Node dot */}
                <div className="relative z-10 flex-shrink-0 w-14 flex justify-center">
                  <div className="w-3 h-3 rounded-full border-2 border-white/[0.1] bg-[#0C0C0C] group-hover:border-[#24D3EE]/50 transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6 border-b border-white/[0.04]">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-[12px] font-mono text-[#24D3EE]">{step.num}</span>
                    <h3 className="text-[16px] font-semibold text-white">{step.label}</h3>
                  </div>
                  <p className="text-[14px] text-zinc-500 ml-8">{step.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
