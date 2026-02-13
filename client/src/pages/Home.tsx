import { motion } from "framer-motion";
import { Download, Shield, Zap, Terminal, Code2, Globe, Disc, Activity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { useLatestRelease } from "@/hooks/use-releases";
import { useQuery } from "@tanstack/react-query";
import { SystemStatus, Release } from "@shared/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function DownloadCard({ executorType, title, description }: { executorType: string; title: string; description: string }) {
  const { data: latest } = useLatestRelease(executorType);

  return (
    <Card className="bg-card/30 border-white/5 backdrop-blur-sm hover:border-primary/50 transition-all flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {executorType.toUpperCase()}
          </Badge>
          {latest && <Badge variant="secondary" className="text-[10px]">{latest.version}</Badge>}
        </div>
        <CardTitle className="text-2xl font-display">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
          asChild
        >
          <Link href={`/download#${executorType}`}>
            <Download className="w-4 h-4" />
            Download {title}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const { data: velocityStatus } = useQuery<SystemStatus>({
    queryKey: ["/api/status", { executorType: "velocity" }],
    queryFn: async () => {
      const res = await fetch("/api/status?executorType=velocity");
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    }
  });
  
  const { data: xenoStatus } = useQuery<SystemStatus>({
    queryKey: ["/api/status", { executorType: "xeno" }],
    queryFn: async () => {
      const res = await fetch("/api/status?executorType=xeno");
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    }
  });

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
      question: "Which API should I choose?",
      answer: "Velocity is our high-performance engine optimized for most scripts. Xeno is a new experimental API designed for maximum stability on complex games. We recommend trying both to see which works best for your setup."
    },
    {
      question: "Does it support Mac/Mobile?",
      answer: "Currently, Zenon is only available for Windows PC."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
              One Tool. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent text-glow">
                Dual Execution.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The most powerful, undetectable, and feature-rich script executor for Roblox.
              Choose between Velocity and Xeno for the ultimate gaming experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              <DownloadCard 
                executorType="velocity" 
                title="Velocity API" 
                description="Our flagship execution engine. Ultra-fast, reliable, and compatible with 99% of scripts."
              />
              <DownloadCard 
                executorType="xeno" 
                title="Xeno API" 
                description="New experimental engine. Built for maximum stability and anti-detection on heavily protected games."
              />
            </div>
            
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 mr-4">
                  <div className={`w-2 h-2 rounded-full ${velocityStatus?.isUp ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-xs uppercase font-bold">Velocity: {velocityStatus?.isUp ? "Online" : "Offline"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${xenoStatus?.isUp ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-xs uppercase font-bold">Xeno: {xenoStatus?.isUp ? "Online" : "Offline"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs uppercase font-bold">Undetected</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Zenon?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the most stable and feature-rich experience with multiple execution backends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Dual API Support"
              description="Switch between Velocity and Xeno engines instantly to find the best performance for your scripts."
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Advanced Stealth"
              description="Both engines use kernel-level anti-tamper protection to bypass the latest detection methods."
              delay={0.1}
            />
            <FeatureCard
              icon={Terminal}
              title="Universal Hub"
              description="Access our unified script hub across all executors. One library, any engine."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">FAQ</h2>
            <p className="text-muted-foreground">Common questions about our dual-API setup.</p>
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
