"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, CheckCircle, Clock, ExternalLink, Globe, LinkIcon, Shield } from "lucide-react";
import AdGrid from "./ads-scripts/AdGrid";
import AdsterraBannerAd from "@/components/ads-scripts/AdsterraBannerAd";
import PopunderAd from "./ads-scripts/PopunderAd";
import NativeBannerAd from "./ads-scripts/NativeBanner";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { validateLongUrl, getDefaultRedirectUrl } from "@/lib/url-validation";

interface UrlData {
  originalUrl: string;
}
export default function GetUrlsPage({ slug }: { slug: string }) {
  const COUNTDOWN_SECONDS = 10;
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [loading, setLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    const GetUrl = async () => {
      try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redirect/${slug}`);
        if (!result.ok) {
          const errorData = await result.json().catch(() => ({}));
          console.error("Error fetching URL:", result.status, errorData);
          setUrlError(errorData.message || "Failed to load the requested URL");
        } else {
          const data: UrlData = await result.json();
          const { isValid } = await validateLongUrl(data.originalUrl);
          setOriginalUrl(data.originalUrl);
          setIsValidUrl(isValid);
          if (!isValid) {
            setUrlError("This link has been blocked due to security restrictions");
          }
        }
      } catch (error) {
        console.error("Error fetching URL:", error);
        setUrlError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    GetUrl();
  }, [slug]);

  useEffect(() => {
    if (loading) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, loading]);

  const redirectUrl = isValidUrl ? originalUrl : getDefaultRedirectUrl();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cookie Consent Banner */}
      <PopunderAd />
      <CookieConsent />
      {/* Main content */}
      <main className="flex-grow container mx-auto">
        <header className="px-4 sm:px-0 container border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        {/* Welcome message */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Thanks for using our URL shortener!</h2>
          <p className="text-muted-foreground">You will be redirected to your destination shortly.</p>
        </div>

        {/* Ad Disclosure Statement */}
        <div className="text-center mb-6 text-sm text-muted-foreground bg-secondary py-2 px-4 rounded-md mx-auto max-w-2xl">
          <p>
            This page contains paid advertisements to support our free URL shortening service.
            <Link href="#premium" className="text-primary hover:text-primary/90 ml-1">
              Upgrade to Premium
            </Link>{" "}
            for an ad-free experience.
          </p>
        </div>

        {/* Ad section 1 - Banner ad */}
        <AdsterraBannerAd />

        {/* About our service - Content Section */}
        <div className="mb-12 bg-card rounded-lg shadow-sm p-6 border border-border">
          <h3 className="text-xl font-semibold mb-4 text-center">About Our URL Shortening Service</h3>
          <p className="text-card-foreground mb-6">
            Our URL shortening service helps you transform long, unwieldy links into short, memorable ones. Whether
            you're sharing links on social media, sending them via email, or just trying to keep things tidy, our
            service makes your links more manageable and trackable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium mb-1">Quick and Easy</h4>
                <p className="text-sm text-muted-foreground">Shorten URLs in seconds with no registration required</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium mb-1">Secure Links</h4>
                <p className="text-sm text-muted-foreground">All links are checked for safety and malicious content</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium mb-1">Detailed Analytics</h4>
                <p className="text-sm text-muted-foreground">Track clicks, geographic data, and referral sources</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium mb-1">Global Access</h4>
                <p className="text-sm text-muted-foreground">Our links work worldwide with 99.9% uptime guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Multiple ads in grid */}
        <AdGrid />

        {/* FAQ Section - More Content */}
        <div className="mb-12 bg-card rounded-lg shadow-sm p-6 border border-border">
          <h3 className="text-xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="text-primary flex-shrink-0" size={18} />
                How long do shortened links last?
              </h4>
              <p className="text-sm text-card-foreground ml-6">
                Our shortened links never expire. They will remain active as long as our service exists.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="text-primary flex-shrink-0" size={18} />
                Is there a limit to how many URLs I can shorten?
              </h4>
              <p className="text-sm text-card-foreground ml-6">
                Free accounts can shorten up to 50 URLs per day. Premium accounts have unlimited shortening
                capabilities.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="text-primary flex-shrink-0" size={18} />
                Can I customize my shortened URLs?
              </h4>
              <p className="text-sm text-card-foreground ml-6">
                Yes! Premium users can create custom branded links with their own domain or choose custom aliases.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="text-primary flex-shrink-0" size={18} />
                Are the shortened links secure?
              </h4>
              <p className="text-sm text-card-foreground ml-6">
                We scan all URLs for malware and phishing attempts. We also offer HTTPS for all links to ensure secure
                connections.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Plan - Ad-free option */}
        <div id="premium" className="mb-12 bg-premium-gradient rounded-lg p-6 border border-primary/20">
          <h3 className="text-xl font-semibold mb-4 text-center">Upgrade to Premium</h3>
          <p className="text-card-foreground mb-6 text-center">
            Enjoy an ad-free experience and unlock powerful features with our Premium plan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
              <h4 className="font-medium text-center mb-3">Ad-Free Experience</h4>
              <p className="text-sm text-muted-foreground text-center">
                No advertisements, just a clean and fast redirection experience.
              </p>
            </div>
            <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
              <h4 className="font-medium text-center mb-3">Custom URLs</h4>
              <p className="text-sm text-muted-foreground text-center">
                Create branded short links with your own domain name or custom aliases.
              </p>
            </div>
            <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
              <h4 className="font-medium text-center mb-3">Advanced Analytics</h4>
              <p className="text-sm text-muted-foreground text-center">
                Get detailed insights about who's clicking your links and when.
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/premium"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-full transition-colors"
            >
              Get Premium
            </Link>
          </div>
        </div>

        {/* Ad section 3 - Video ad placeholder */}
        {/* <div className="mb-12 p-4 bg-secondary rounded-lg border border-border">
          <p className="text-xs text-muted-foreground mb-1">Video Advertisement</p>
          <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Video Advertisement</p>
          </div>
        </div> */}

        {/* Testimonials - Additional Content */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">What Our Users Say</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-muted mr-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Digital Marketer</p>
                </div>
              </div>
              <p className="text-sm text-card-foreground">
                "This URL shortener has been a game-changer for our marketing campaigns. The analytics help us
                understand which channels are performing best."
              </p>
            </div>

            <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-muted mr-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Michael Chen</h4>
                  <p className="text-sm text-muted-foreground">Content Creator</p>
                </div>
              </div>
              <p className="text-sm text-card-foreground">
                "I use this service daily for my social media posts. The custom links feature helps maintain my brand
                consistency across platforms."
              </p>
            </div>
          </div>
        </div>

        {/* Create a new URL section */}
        <div className="mb-12 bg-card rounded-lg shadow-sm p-6 border border-border">
          <h3 className="text-xl font-semibold mb-4 text-center">Create Another Short URL</h3>
          <p className="text-card-foreground mb-6 text-center">Need to shorten another link? Use our tool below:</p>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter a long URL"
                className="flex-grow px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Link href="/login?callbackUrl=/dashboard">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition-colors">
                  Shorten
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background pattern section */}
        <div className="mb-12 p-8 rounded-lg bg-grid-pattern">
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border text-center">
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust our URL shortening service every day.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-full transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Countdown and skip option */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground mb-4">
            {loading
              ? "Loading..."
              : urlError
                ? urlError
                : "You can proceed to your destination now"
            }
          </p>
          {isValidUrl && (
            <Link
              href={redirectUrl}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-full transition-colors"
            >
              Continue to Destination <ExternalLink size={16} />
            </Link>
          )}
        </div>
        <NativeBannerAd />
      </main>

      {/* Footer with redirect link */}
      <footer className="bg-card text-card-foreground py-6 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2025 ShortCash</p>
              <div className="flex gap-4 mt-2">
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">
                  Terms
                </Link>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">
                  Privacy
                </Link>
                <Link href="/contact" className="text-xs text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Cookie Consent Banner Component
function CookieConsent() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border text-card-foreground p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p>
            We use cookies to improve your experience and show relevant ads. By using our site, you agree to our use of
            cookies.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsVisible(false)}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm py-1 px-4 rounded-md"
          >
            Decline
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-1 px-4 rounded-md"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
