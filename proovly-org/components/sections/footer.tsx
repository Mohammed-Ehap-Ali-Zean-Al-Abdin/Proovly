"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

const links = {
  product: [
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Donor Portal", href: process.env.NEXT_PUBLIC_DONOR_PORTAL_URL || "http://localhost:3000" },
    { name: "NGO Portal", href: process.env.NEXT_PUBLIC_NGO_PORTAL_URL || "http://localhost:3001" },
  ],
  legal: [
    { name: "Terms", href: "#terms" },
    { name: "Privacy", href: "#privacy" },
    { name: "Security", href: "#security" },
    { name: "API Docs", href: process.env.NEXT_PUBLIC_API_DOCS_URL || "http://localhost:4000/api-docs" },
  ],
}

export default function Footer() {
  const prefersReducedMotion = useReducedMotion()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  // Deterministic positions to avoid SSR/client hydration mismatches
  const dots = Array.from({ length: 5 }, (_, i) => {
    const left = ((Math.abs(Math.sin((i + 1) * 12.9898)) * 100) % 100).toFixed(2)
    const top = ((Math.abs(Math.cos((i + 1) * 78.233)) * 100) % 100).toFixed(2)
    return { left: `${left}%`, top: `${top}%`, delay: i * 0.5, duration: 4 + i }
  })

  return (
    <footer className="bg-[#2B2B2B] text-white py-16 px-6 relative overflow-hidden">
      {/* Animated background network */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {dots.map((d, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#93B273] rounded-full"
            style={{
              left: d.left,
              top: d.top,
            }}
            animate={{
              y: prefersReducedMotion ? 0 : [0, -20, 0],
              opacity: prefersReducedMotion ? 0.4 : [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: d.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: d.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proovly%20org%20icon-A4mWOQhGyzebCAsHh04xaVTSrgo2K5.png"
              alt="Proovly"
              width={60}
              height={60}
              className="mb-4"
            />
            <p className="text-gray-400 text-sm">Proving impact. Building trust. Changing the world.</p>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4 text-[#93B273]">Product</h4>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-[#93B273] transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4 text-[#93B273]">Legal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-[#93B273] transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4 text-[#93B273]">Connect</h4>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#93B273]/20 hover:bg-[#93B273]/40 flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <span className="text-xs font-semibold">{social[0]}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm"
        >
          <p>&copy; 2025 Proovly. All rights reserved.</p>
          <p>Powered by Hedera Blockchain</p>
        </motion.div>
      </motion.div>
    </footer>
  )
}
