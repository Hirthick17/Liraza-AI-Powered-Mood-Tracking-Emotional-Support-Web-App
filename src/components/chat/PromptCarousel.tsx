import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MessageCircle, Lightbulb, Heart, Wind, Target } from "lucide-react";

interface PromptSuggestion {
  type: "reflection" | "empowerment" | "rest" | "validation" | "action";
  text: string;
  icon: React.ReactNode;
}

interface PromptCarouselProps {
  suggestions: PromptSuggestion[];
  onSelect: (suggestion: PromptSuggestion) => void;
}

const typeConfig = {
  reflection: { icon: MessageCircle, gradient: "from-blue-400/20 to-purple-400/20" },
  empowerment: { icon: Lightbulb, gradient: "from-amber-400/20 to-orange-400/20" },
  rest: { icon: Wind, gradient: "from-cyan-400/20 to-teal-400/20" },
  validation: { icon: Heart, gradient: "from-pink-400/20 to-rose-400/20" },
  action: { icon: Target, gradient: "from-green-400/20 to-emerald-400/20" },
};

export const PromptCarousel = ({ suggestions, onSelect }: PromptCarouselProps) => {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full overflow-x-auto pb-2 scrollbar-hide"
    >
      <div className="flex gap-3 px-1">
        {suggestions.map((suggestion, index) => {
          const config = typeConfig[suggestion.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`min-w-[280px] p-4 cursor-pointer bg-gradient-to-br ${config.gradient} 
                  backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all`}
                onClick={() => onSelect(suggestion)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {suggestion.text}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
