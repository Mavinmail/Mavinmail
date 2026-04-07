"use client"

import { motion } from "framer-motion"

export function WorkflowDiagrams() {
  return (
    <section className="py-28 bg-[#0C0C0C] border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-[11px] font-medium text-[#24D3EE] uppercase tracking-[0.15em] mb-3 font-mono">
            AI Output
          </p>
          <h2 className="text-[32px] font-bold text-white tracking-[-0.02em] leading-tight">
            See what MavinMail returns
          </h2>
          <p className="mt-4 text-[15px] text-zinc-500 leading-relaxed">
            Real outputs from real emails. Summaries, suggested replies, and extracted actions — all instant.
          </p>
        </div>

        {/* Two-panel preview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Email Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="rounded-lg border border-white/[0.06] bg-[#111111] overflow-hidden"
          >
            {/* Tab bar */}
            <div className="h-10 border-b border-white/[0.06] flex items-center px-4 gap-4">
              <span className="text-[12px] font-medium text-white">Summary</span>
              <span className="text-[12px] text-zinc-600">Raw Email</span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Subject</p>
                <p className="text-[14px] text-zinc-300">Re: Q3 Budget Approval — Final Review</p>
              </div>

              <div>
                <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Key Points</p>
                <ul className="space-y-2">
                  {[
                    "Budget approved at $142K for Q3",
                    "Marketing allocation increased by 15%",
                    "Deadline for vendor contracts: July 12",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#24D3EE] flex-shrink-0" />
                      <span className="text-[14px] text-zinc-400">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Action Required</p>
                <p className="text-[14px] text-zinc-400">Send signed approval to finance@company.com by Friday.</p>
              </div>
            </div>
          </motion.div>

          {/* Suggested Reply */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-lg border border-white/[0.06] bg-[#111111] overflow-hidden"
          >
            {/* Tab bar */}
            <div className="h-10 border-b border-white/[0.06] flex items-center px-4 gap-4">
              <span className="text-[12px] font-medium text-white">Suggested Reply</span>
              <span className="text-[12px] text-zinc-600">Edit</span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-2">To</p>
                <p className="text-[14px] text-zinc-300">sarah.chen@company.com</p>
              </div>

              <div>
                <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Draft</p>
                <div className="text-[14px] text-zinc-400 leading-relaxed space-y-3">
                  <p>Hi Sarah,</p>
                  <p>Thanks for confirming the Q3 budget. I've noted the updated marketing allocation and will have the vendor contracts finalized before the July 12 deadline.</p>
                  <p>I'll send the signed approval to finance by end of day Friday.</p>
                  <p>Best,<br />Alex</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="h-8 px-4 rounded-md bg-white text-[#0C0C0C] text-[12px] font-medium hover:bg-zinc-200 transition-colors">
                  Send
                </button>
                <button className="h-8 px-4 rounded-md border border-white/[0.08] text-[12px] text-zinc-500 hover:text-white hover:border-white/[0.15] transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
