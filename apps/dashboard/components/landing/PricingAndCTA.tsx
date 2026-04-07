"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Top-Up",
    price: "5",
    period: "",
    description: "Add credits instantly when you need them",
    highlight: false,
    cta: "Get credits",
    features: [
      "1,000 AI Credits",
      "No expiration",
      "Stack with any plan",
      "Instant delivery",
    ],
  },
  {
    name: "Pro",
    price: "30",
    period: "/mo",
    description: "More power as your inbox grows",
    highlight: true,
    cta: "Start your trial",
    features: [
      "10,000 AI Credits per month",
      "All AI features unlocked",
      "Premium models (GPT-4o, Claude)",
      "Multiple accounts",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "",
    period: "",
    description: "Custom solutions for large organizations",
    highlight: false,
    cta: "Contact Us",
    features: [
      "Unlimited AI Actions",
      "Dedicated infrastructure",
      "Custom integrations",
      "SSO authentication",
      "24/7 Priority support",
    ],
  },
]

export function PricingAndCTA() {
  return (
    <>
      {/* Pricing */}
      <section id="pricing" className="py-28 bg-[#0C0C0C] border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-[11px] font-medium text-[#24D3EE] uppercase tracking-[0.15em] mb-3 font-mono">
              Pricing
            </p>
            <h2 className="text-[32px] font-bold text-white tracking-[-0.02em] leading-tight">
              Pricing that matches how you work
            </h2>
            <p className="mt-4 text-[15px] text-zinc-500 leading-relaxed">
              Start simple, upgrade when your workflow gets more complex.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-lg overflow-hidden border border-white/[0.06]">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className={`p-8 flex flex-col ${plan.highlight ? "bg-[#111111]" : "bg-[#0C0C0C]"}`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[16px] font-semibold text-white">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="text-[10px] font-mono font-medium text-[#24D3EE] border border-[#24D3EE]/20 rounded px-1.5 py-0.5 uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-zinc-500 mb-6">{plan.description}</p>

                <div className="flex items-baseline gap-0.5 mb-8 min-h-[48px]">
                  {plan.price ? (
                    <>
                      <span className="text-[40px] font-bold text-white tracking-tight">${plan.price}</span>
                      {plan.period && <span className="text-[14px] text-zinc-600">{plan.period}</span>}
                    </>
                  ) : (
                    <span className="text-[32px] font-bold text-white tracking-tight">Custom</span>
                  )}
                </div>

                <Link href="/signup" className="mb-8">
                  <button
                    className={`w-full h-10 rounded-md text-[13px] font-medium transition-colors ${
                      plan.highlight
                        ? "bg-white text-[#0C0C0C] hover:bg-zinc-200"
                        : "border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.15]"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>

                <div className="space-y-3 mt-auto">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 ${plan.highlight ? "text-[#24D3EE]" : "text-zinc-600"}`} />
                      <span className="text-[13px] text-zinc-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-center text-[12px] text-zinc-600">
            14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-[#0C0C0C] border-t border-white/[0.04]">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[clamp(2rem,4vw,3rem)] font-bold text-white tracking-[-0.03em] leading-tight"
          >
            Take control of your inbox.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 text-[15px] text-zinc-500"
          >
            Stop managing emails manually. Let intelligence handle the rest.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8"
          >
            <Link href="/signup">
              <button className="h-10 px-8 rounded-md bg-white text-[#0C0C0C] text-[14px] font-medium hover:bg-zinc-200 transition-colors">
                Start using MavinMail
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
