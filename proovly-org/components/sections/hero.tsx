"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        delayChildren: prefersReducedMotion ? 0 : 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.8 },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F9FAF9] to-[#F0F3ED] pt-20 pb-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[#93B273]/10 to-[#617A39]/5 rounded-full blur-3xl"
          animate={prefersReducedMotion ? undefined : { y: [0, 30, 0], x: [0, 20, 0] }}
          transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-[#617A39]/10 to-[#C9E6C8]/5 rounded-full blur-3xl"
          animate={prefersReducedMotion ? undefined : { y: [0, -30, 0], x: [0, -20, 0] }}
          transition={prefersReducedMotion ? undefined : { duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proovly%20org%20icon-A4mWOQhGyzebCAsHh04xaVTSrgo2K5.png"
            alt="Proovly Icon"
            width={120}
            height={120}
            className="drop-shadow-lg"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-[#2B2B2B] mb-6 text-balance">
          Prove Impact.{" "}
          <span className="bg-gradient-to-r from-[#93B273] to-[#617A39] bg-clip-text text-transparent">
            Build Trust.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-[#556B5A] mb-12 text-balance leading-relaxed"
        >
          Empowering NGOs and donors to create verifiable change through blockchain transparency.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-[#93B273] to-[#617A39] hover:from-[#7FA35F] hover:to-[#556B5A] text-white px-8 py-6 text-lg rounded-lg"
            asChild
          >
            <motion.a
              href={process.env.NEXT_PUBLIC_DONOR_PORTAL_URL || "http://localhost:3000"}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02, boxShadow: "0 10px 30px rgba(97,122,57,0.25)" }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="relative inline-flex items-center justify-center"
            >
              Explore Platform
            </motion.a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="group border-2 border-[#93B273] text-[#617A39] hover:bg-[#F0F3ED] px-8 py-6 text-lg rounded-lg bg-transparent"
            asChild
          >
            <motion.a
              href={process.env.NEXT_PUBLIC_NGO_PORTAL_URL || "http://localhost:3001"}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02, boxShadow: "0 10px 30px rgba(147,178,115,0.25)" }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="relative inline-flex items-center justify-center"
            >
              Join as NGO
            </motion.a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
