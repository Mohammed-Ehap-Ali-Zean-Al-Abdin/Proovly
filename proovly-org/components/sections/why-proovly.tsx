"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const features = [
  {
    icon: "🛡️",
    title: "Immutable Proof of Impact",
    description: "Every donation is permanently recorded on the blockchain, creating an unchangeable record of impact.",
  },
  {
    icon: "🌍",
    title: "Global Transparency",
    description: "Connect with donors and NGOs worldwide in a transparent ecosystem built on trust.",
  },
  {
    icon: "⚙️",
    title: "Easy Integration",
    description: "Simple APIs and dashboards make it effortless for NGOs to get started and track impact.",
  },
  {
    icon: "💚",
    title: "Empowering Ethical Giving",
    description: "Enable donors to make informed decisions with verified impact data at their fingertips.",
  },
]

export default function WhyProovly() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-b from-[#F9FAF9] to-[#F0F3ED]">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={containerVariants}>
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-4 text-balance">Why Choose Proovly?</h2>
            <p className="text-lg text-[#556B5A] max-w-2xl mx-auto">
              Built for trust, designed for impact, powered by blockchain.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(147, 178, 115, 0.15)" }}
                className="bg-white rounded-2xl p-8 shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-[#2B2B2B] mb-3">{feature.title}</h3>
                <p className="text-[#556B5A] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
