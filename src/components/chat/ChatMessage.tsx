import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  index: number;
}

export const ChatMessage = ({ role, content, index }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={`max-w-[80%] rounded-3xl px-5 py-4 ${
          role === "user"
            ? "bg-gradient-to-br from-primary to-secondary text-white shadow-[var(--shadow-float)]"
            : "bg-white/95 backdrop-blur-sm shadow-[var(--shadow-float)] border-2 border-primary/30 text-primary"
        }`}
      >
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
          role === "user" ? "text-white" : "text-primary font-medium"
        }`}>
          {content}
        </p>
      </motion.div>
    </motion.div>
  );
};
