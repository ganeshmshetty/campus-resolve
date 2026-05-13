import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldAlert, ArrowRight, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">CampusResolve</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground hidden sm:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground hidden sm:block" href="#how-it-works">
            How it Works
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="font-medium bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-grid-black/[0.02] relative overflow-hidden">
          {/* Decorative background blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  Your Campus, Better Together
                </div>
                <h1 className="text-4xl font-heading font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none text-foreground">
                  Report issues. Spark <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">change.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A creative, community-driven platform to report infrastructure, safety, and maintenance issues around campus. Let's build a better environment for everyone.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full font-medium h-12 px-8 rounded-full shadow-sm">
                    Start Reporting <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full font-medium h-12 px-8 rounded-full border-border/50 bg-background/50 backdrop-blur-sm">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30 border-y border-border/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold font-heading tracking-tight sm:text-4xl">Empowering the Community</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Everything you need to make your voice heard and track the resolution of campus issues.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4 p-6 bg-background rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading">Pinpoint Accuracy</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Use interactive maps to drop a pin exactly where the issue is, making it easy for authorities to locate.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 p-6 bg-background rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-accent/10 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-2">
                  <ShieldAlert className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold font-heading">Categorized Reporting</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  From broken streetlights to water leaks, categorize your reports so they reach the right department instantly.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 p-6 bg-background rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-secondary/10 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-2">
                  <Activity className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold font-heading">Real-time Updates</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track the status of your reports from "Open" to "Resolved" with transparent progress indicators.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40 bg-background">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CampusResolve. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
