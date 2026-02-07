import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function FAQ() {
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
      question: "How do I get a key?",
      answer: "The key system is straightforward. When you launch Zenon, click 'Get Key' which will take you to our key generation page. Complete the short steps to receive your 24-hour key."
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
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}
