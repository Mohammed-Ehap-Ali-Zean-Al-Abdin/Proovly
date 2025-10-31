"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function CTA() {
  const prefersReducedMotion = useReducedMotion()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-[#93B273] via-[#7FA35F] to-[#617A39] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
          Transparency Starts with You
        </motion.h2>

        <motion.p variants={itemVariants} className="text-xl text-white/90 mb-12 text-balance leading-relaxed">
          Join thousands of donors and NGOs building a more transparent world.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="group bg-white text-[#617A39] hover:bg-[#F0F3ED] px-8 py-6 text-lg rounded-lg font-semibold"
            asChild
          >
            <motion.a
              href={process.env.NEXT_PUBLIC_NGO_PORTAL_URL || "http://localhost:3001"}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02, boxShadow: "0 8px 24px rgba(97,122,57,0.18)" }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="inline-flex items-center justify-center"
            >
              Join as NGO
            </motion.a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="group border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg font-semibold bg-transparent"
            asChild
          >
            <motion.a
              href={process.env.NEXT_PUBLIC_DONOR_PORTAL_URL || "http://localhost:3000"}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02, boxShadow: "0 8px 24px rgba(255,255,255,0.25)" }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="inline-flex items-center justify-center"
            >
              Donate Now
            </motion.a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
