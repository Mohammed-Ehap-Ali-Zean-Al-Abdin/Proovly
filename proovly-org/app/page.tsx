import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import HowItWorks from "@/components/sections/how-it-works"
import Dashboard from "@/components/sections/dashboard"
import WhyProovly from "@/components/sections/why-proovly"
import CTA from "@/components/sections/cta"
import Footer from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="overflow-hidden bg-white">
      <Hero />
      <About />
      <HowItWorks />
      <Dashboard />
      <WhyProovly />
      <CTA />
      <Footer />
    </main>
  )
}
