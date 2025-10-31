"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"

export default function About() {
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Left - Image */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proovly%20org%20logo-moGueVRgqhFiGxEHx1ur79oRnK4HpK.png"
              alt="Proovly Logo"
              width={400}
              height={400}
              className="drop-shadow-xl"
            />
          </motion.div>

          {/* Right - Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] text-balance">
              Transparency Starts with <span className="text-[#93B273]">Accountability</span>
            </h2>
            <p className="text-lg text-[#556B5A] leading-relaxed">
              Proovly revolutionizes how donations are tracked and verified. Every contribution is recorded on the
              Hedera blockchain, creating an immutable record of impact that donors and NGOs can trust.
            </p>
            <p className="text-lg text-[#556B5A] leading-relaxed">
              We believe that transparency isn't just about numbers—it's about building a global community where every
              donation creates measurable, verifiable change. With Proovly, trust is no longer a promise. It's a proof.
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#93B273] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-[#2B2B2B]">Immutable blockchain records</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#93B273] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-[#2B2B2B]">Real-time impact verification</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#93B273] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-[#2B2B2B]">Global transparency network</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
