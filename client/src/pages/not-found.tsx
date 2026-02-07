import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6 animate-pulse">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      
      <h1 className="text-4xl font-display font-bold mb-2">404 Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link href="/">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
