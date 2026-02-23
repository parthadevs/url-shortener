"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { ArrowRight, CheckCircle, LinkIcon, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { JsonLd } from "@/components/json-ld"

export default function Home() {
  // Refs for intersection observer animations
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const testimonialsRef = useRef(null)

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroElement = document.querySelector(".hero-parallax")
      if (heroElement) {
        (heroElement as HTMLElement).style.transform = `translateY(${scrollY * 0.1}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fade-in animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="flex justify-center">
      <div className="flex min-h-screen flex-col justify-center">
        {/* SEO - JSON-LD Structured Data */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ShortCash",
            url: "https://shortcash.example.com",
            applicationCategory: "BusinessApplication",
            description:
              "ShortCash is a premium URL shortener that pays you for every click. Create short, branded links and monetize your online presence.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            operatingSystem: "Web",
            screenshot: "https://shortcash.example.com/screenshots/dashboard.jpg",
            featureList: "URL Shortening, Link Monetization, Analytics, Custom URLs",
            author: {
              "@type": "Organization",
              name: "ShortCash",
              url: "https://shortcash.example.com",
            },
          }}
        />

        <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <motion.div
            className="flex h-16 items-center justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 font-bold">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <LinkIcon className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="font-heading text-xl">ShortCash</span>
            </div>
            <nav className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        </header>

        <main className="py-6 ">
          {/* Hero Section */}
          <section className="container relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-20 md:py-32 rounded-xl">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="container relative px-4 md:px-6">
              <div className="flex items-center grid gap-10 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                <motion.div
                  className="flex flex-col justify-center space-y-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="space-y-6">
                    <motion.div
                      className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium">Premium URL Shortener</span>
                    </motion.div>
                    <motion.h1
                      className="font-heading text-3xl font-bold tracking-tight sm:text-3xl md:text-6xl lg:text-5xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      Shorten URLs &{" "}
                      <span className="text-primary relative">
                        Earn Money
                        <span className="absolute bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
                      </span>
                    </motion.h1>
                    <motion.p
                      className="max-w-[600px] text-muted-foreground md:text-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Turn your links into cash. Create short URLs and earn money every time someone visits your links.
                      The premium URL shortener that pays you.
                    </motion.p>
                  </div>
                  <motion.div
                    className="flex flex-col gap-3 min-[400px]:flex-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        asChild
                        size="lg"
                        className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                      >
                        <Link href="/signup">
                          Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="lg" asChild>
                        <Link href="#how-it-works">Learn More</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="flex flex-wrap items-center gap-6 pt-4"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={fadeInUp} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">No credit card required</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Free to get started</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">1 to 3 days payouts</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-primary-foreground opacity-30 blur-xl animate-pulse"></div>
                  <motion.div
                    className="relative rounded-xl border bg-background p-8 shadow-xl"
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold font-heading">Shorten a URL</h3>
                        <p className="text-sm text-muted-foreground">Enter a long URL to create a short link</p>
                      </div>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                            placeholder="Enter Your Orginal Url..."
                            type="url"
                          />
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full shadow-lg shadow-primary/20" disabled>
                            Shorten URL
                            <span className="ml-2 rounded-full text-black bg-primary-foreground px-2 py-0.5 text-xs font-semibold">
                              Sign up to use
                            </span>
                          </Button>
                        </motion.div>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-lg bg-muted p-3 text-xs">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                          >
                            <Sparkles className="h-3 w-3 text-primary" />
                          </motion.div>
                          <span className="font-medium">Premium Features</span>
                        </div>
                        <span className="text-muted-foreground">Custom URLs, Analytics & More</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
            <div className="hero-parallax absolute inset-0 pointer-events-none">
              <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-xl"></div>
              <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-primary/10 blur-xl"></div>
            </div>
          </section>

          {/* Social Proof */}
          <section className="border-b bg-muted/30 py-8 overflow-hidden">
            <motion.div
              className="container px-4 md:px-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Trusted by thousands of users worldwide
                </p>
                <motion.div
                  className="flex flex-wrap items-center justify-center gap-8 grayscale opacity-70"
                  initial={{ x: -1000 }}
                  animate={{ x: 0 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Image
                      key={i}
                      src="/placeholder.svg?height=30&width=120"
                      alt={`Company ${i + 1}`}
                      width={120}
                      height={30}
                      className="h-8 object-contain mx-4"
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="w-full py-20 " ref={howItWorksRef}>
            <div className="container px-4 md:px-6">
              <motion.div
                className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">How It Works</h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  Earn money by sharing your shortened links. It's simple and effective.
                </p>
              </motion.div>
              <motion.div
                className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div
                  className="relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-md"
                  variants={fadeInUp}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    borderColor: "hsl(var(--primary) / 0.3)",
                  }}
                >
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    <LinkIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-heading">Create Short Links</h3>
                  <p className="mt-2 text-muted-foreground">
                    Sign up and start shortening your URLs with our easy-to-use platform.
                  </p>
                </motion.div>
                <motion.div
                  className="relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                  variants={fadeInUp}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    borderColor: "hsl(var(--primary) / 0.3)",
                  }}
                >
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold font-heading">Share Your Links</h3>
                  <p className="mt-2 text-muted-foreground">
                    Share your shortened links on social media, emails, or anywhere you want.
                  </p>
                </motion.div>
                <motion.div
                  className="relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                  variants={fadeInUp}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    borderColor: "hsl(var(--primary) / 0.3)",
                  }}
                >
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold font-heading">Earn Money</h3>
                  <p className="mt-2 text-muted-foreground">
                    Earn money every time someone visits your links and views the ads.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="w-full bg-muted/30 py-20 relative overflow-hidden rounded-xl" ref={featuresRef}>
            <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="container px-4 md:px-6 relative">
              <motion.div
                className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                  Premium Features
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  Everything you need to monetize your links with a premium experience
                </p>
              </motion.div>
              <motion.div
                className="mx-auto grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: <LinkIcon className="h-6 w-6" />,
                    title: "Custom Short URLs",
                    description: "Create memorable and branded short links",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    ),
                    title: "Monetization",
                    description: "Earn money from every click on your links",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                    ),
                    title: "Analytics",
                    description: "Track clicks, earnings, and performance",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    ),
                    title: "User-Friendly",
                    description: "Easy to use dashboard and management tools",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-3 rounded-xl border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md"
                    variants={fadeInUp}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      borderColor: "hsl(var(--primary) / 0.3)",
                    }}
                  >
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg font-bold font-heading">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="w-full py-20" ref={testimonialsRef}>
            <div className="container px-4 md:px-6">
              <motion.div
                className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                  What Our Users Say
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  Join thousands of satisfied users who are already earning with ShortCash
                </p>
              </motion.div>
              <motion.div
                className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    text: "I've been using ShortCash for 3 months and already earned over $500. The dashboard is so easy to use and the payouts are always on time.",
                    name: "Sarah Johnson",
                    role: "Content Creator",
                  },
                  {
                    text: "The analytics are incredible. I can see exactly which links perform best and optimize my strategy. Best URL shortener I've used.",
                    name: "Michael Chen",
                    role: "Digital Marketer",
                  },
                  {
                    text: "As a blogger, ShortCash has been a game-changer. I've monetized all my links and the custom URLs help maintain my brand identity. Highly recommended!",
                    name: "Jessica Williams",
                    role: "Lifestyle Blogger",
                    span: "md:col-span-2 lg:col-span-1",
                  },
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className={`flex flex-col justify-between rounded-xl border bg-background p-6 shadow-sm ${testimonial.span || ""}`}
                    variants={fadeInUp}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      borderColor: "hsl(var(--primary) / 0.3)",
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex gap-0.5 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="none"
                            className="h-5 w-5"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-muted-foreground">"{testimonial.text}"</p>
                    </div>
                    <div className="mt-6 flex items-center gap-3 pt-4 border-t">
                      <motion.div
                        className="h-10 w-10 rounded-full bg-muted"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      ></motion.div>
                      <div>
                        <p className="text-sm font-medium">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* CTA */}
          <section className="w-full bg-muted/30 py-20 relative overflow-hidden rounded-xl">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="container px-4 md:px-6 relative">
              <motion.div
                className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                  Ready to Start Earning?
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  Join thousands of users who are already earning money with ShortCash
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                  <Button
                    asChild
                    size="lg"
                    className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    <Link href="/signup">
                      Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.p
                  className="mt-2 text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  No credit card required
                </motion.p>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="w-full border-t py-12 md:py-16 lg:py-20">
          <div className="container grid gap-8 px-4 md:px-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 font-bold">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <LinkIcon className="h-5 w-5 text-primary" />
                </motion.div>
                <span className="font-heading text-xl">ShortCash</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Turn your links into cash. Create short URLs and earn money every time someone visits your links.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="mb-4 text-lg font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="mb-4 text-lg font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="mb-4 text-lg font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            className="container mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row md:gap-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2024 ShortCash. All rights reserved.
            </p>
            <div className="flex gap-4">
              <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  )
}
