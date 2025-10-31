"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const steps = [
  {
    number: "01",
    title: "Donate Securely",
    description: "Donors contribute through Proovly.app with full transparency and security.",
    icon: "💳",
  },
  {
    number: "02",
    title: "NGO Confirmation",
    description: "NGOs verify delivery and impact through Proovly.cloud dashboard.",
    icon: "✓",
  },
  {
    number: "03",
    title: "Blockchain Proof",
    description: "Impact is recorded on Hedera blockchain and visible to everyone.",
    icon: "⛓️",
  },
]

export default function HowItWorks() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-b from-[#F9FAF9] to-[#F0F3ED]">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-4 text-balance">How It Works</h2>
            <p className="text-lg text-[#556B5A] max-w-2xl mx-auto">
              Three simple steps to create verifiable impact and build lasting trust.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-[60%] w-[calc(100%-60px)] h-1 bg-gradient-to-r from-[#93B273] to-transparent" />
                )}

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  {/* Number badge */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#93B273] to-[#617A39] flex items-center justify-center mb-6">
                    <span className="text-white text-2xl font-bold">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-4">{step.icon}</div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-3">{step.title}</h3>
                  <p className="text-[#556B5A] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
