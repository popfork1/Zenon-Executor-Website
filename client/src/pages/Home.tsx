import { motion } from "framer-motion";
import { Download, Shield, Zap, Terminal, Code2, Globe } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { useLatestRelease } from "@/hooks/use-releases";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const { data: latest } = useLatestRelease();

  const faqs = [
    {
      question: "Is Zenon safe to use?",
      answer: "Yes, Zenon is completely safe. However, due to the nature of how executors work (injecting code into other processes), antivirus software may flag it as a false positive. We recommend disabling your antivirus while downloading and using Zenon."
    },
    {
      question: "Will I get banned?",
      answer: "Zenon uses advanced anti-detection methods to keep you safe. However, there is always a small risk when exploiting. We recommend using an alt account for maximum safety."
    },
    {
      question: "Why is it not injecting?",
      answer: "Make sure you have installed all required dependencies (VC++ Redistributable) and that your antivirus is not blocking the process. Also ensure you are using the Microsoft Store version of Roblox if specified in the current patch notes."
    },
    {
      question: "Does it support Mac/Mobile?",
      answer: "Currently, Zenon is only available for Windows PC. We are actively working on mobile and macOS versions, so stay tuned for updates."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Version {latest?.version || "2.0"} Now Available
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
              Dominate with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent text-glow">
                Zenon Executor
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The most powerful, undetectable, and feature-rich script executor for Roblox.
              Experience next-level gaming with our premium execution engine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/download">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.6)] hover:-translate-y-1 transition-all">
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Undetected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{(latest?.downloadCount || 15420).toLocaleString()}+ Downloads</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by developers for gamers. We provide the most stable and feature-rich experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Optimized execution engine ensures your scripts run with zero latency and maximum performance."
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="100% Undetectable"
              description="Advanced anti-tamper protection and unique injection methods keep your account safe."
              delay={0.1}
            />
            <FeatureCard
              icon={Terminal}
              title="Custom Script Hub"
              description="Access thousands of pre-loaded scripts directly from our built-in cloud script hub."
              delay={0.2}
            />
            <FeatureCard
              icon={Code2}
              title="Level 8 Execution"
              description="Full support for all major script functions and libraries. Run anything you want."
              delay={0.3}
            />
            <FeatureCard
              icon={Globe}
              title="24/7 Support"
              description="Our dedicated support team is always available to help you with any issues."
              delay={0.4}
            />
            <FeatureCard
              icon={Download}
              title="Auto Updates"
              description="Never worry about updates again. Zenon automatically updates to the latest version."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { label: "UNC", value: "99%" },
              { label: "sUNC", value: "98%" },
              { label: "Level", value: "8" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 min-w-[200px] rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
              >
                <div className="text-3xl md:text-4xl font-bold font-display text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">FAQ</h2>
            <p className="text-muted-foreground">Got questions? We've got answers.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="border border-white/5 bg-card/30 rounded-lg px-4 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors py-4 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
