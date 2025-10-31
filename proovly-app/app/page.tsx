import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Users, BarChart3, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proovly%20logo-HW9xEvqq79uHzkMV34COICjk4o62LA.png"
              alt="Proovly"
              className="h-8 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Features
            </Link>
            <Link href="#impact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Impact
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Prove Impact.
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600 bg-clip-text text-transparent">
                  Build Trust.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
                Empower your organization to demonstrate real-world impact. Track donations, measure outcomes, and build
                lasting trust with your community.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup?role=donor">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-96 md:h-full">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proovly%20icon-nH01AYLBnpC1ZdxL8S15Vu706jFPb6.png"
              alt="Proovly Icon"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">$2.5B+</div>
              <p className="text-sm md:text-base text-slate-600">Donations Tracked</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">50K+</div>
              <p className="text-sm md:text-base text-slate-600">Organizations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">1M+</div>
              <p className="text-sm md:text-base text-slate-600">Active Donors</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">98%</div>
              <p className="text-sm md:text-base text-slate-600">Trust Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features for Every Role</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you're a donor, organization, or administrator, Proovly provides the tools you need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Donor Features */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
            <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Donors</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Track your donations in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>See measurable impact reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Receive tax documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Connect with causes you care about</span>
              </li>
            </ul>
            <Link href="/signup?role=donor" className="mt-6 block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started as Donor</Button>
            </Link>
          </div>

          {/* Organization Features */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border border-teal-200">
            <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Organizations</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold mt-1">•</span>
                <span>Manage donations effortlessly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold mt-1">•</span>
                <span>Generate impact reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold mt-1">•</span>
                <span>Build donor relationships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold mt-1">•</span>
                <span>Demonstrate transparency</span>
              </li>
            </ul>
            <Link href="/signup?role=organization" className="mt-6 block">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Get Started as Organization</Button>
            </Link>
          </div>

          {/* Admin Features */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
            <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Admins</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Oversee all platform activity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Manage user accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Monitor compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Access analytics dashboard</span>
              </li>
            </ul>
            <Link href="/login" className="mt-6 block">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Admin Login</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Real Impact, Real Results</h2>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Organizations using Proovly see increased donor engagement, improved transparency, and stronger community
            trust.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <BarChart3 className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">300% Increase</h3>
              <p className="opacity-90">in donor retention after implementing impact tracking</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <Globe className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Global Reach</h3>
              <p className="opacity-90">Supporting organizations across 150+ countries</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <Shield className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Secure</h3>
              <p className="opacity-90">Enterprise-grade security and compliance standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="bg-slate-900 rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations and donors building a more transparent, trustworthy world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proovly%20logo-HW9xEvqq79uHzkMV34COICjk4o62LA.png"
                alt="Proovly"
                className="h-6 w-auto mb-4"
              />
              <p className="text-sm text-slate-600">Prove Impact. Build Trust.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#features" className="hover:text-slate-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-slate-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2025 Proovly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
