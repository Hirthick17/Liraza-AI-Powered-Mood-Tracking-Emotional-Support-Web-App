import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MoodRingProps {
  mood: "calm" | "reflective" | "joyful" | "sad" | "angry" | "healing";
}

const moodConfig = {
  calm: {
    color: "hsl(220, 70%, 65%)",
    animation: "breathing",
    description: "Peaceful conversation",
  },
  reflective: {
    color: "hsl(35, 65%, 60%)",
    animation: "ripple",
    description: "Deep emotional talk",
  },
  joyful: {
    color: "hsl(45, 95%, 60%)",
    animation: "sparkle",
    description: "High positivity",
  },
  sad: {
    color: "hsl(215, 20%, 55%)",
    animation: "dimming",
    description: "Emotional fatigue",
  },
  angry: {
    color: "hsl(15, 75%, 55%)",
    animation: "vibration",
    description: "Emotional distress",
  },
  healing: {
    color: "hsl(270, 45%, 70%)",
    animation: "glow",
    description: "Recovery state",
  },
};

export const MoodRing = ({ mood }: MoodRingProps) => {
  const [config, setConfig] = useState(moodConfig[mood]);

  useEffect(() => {
    setConfig(moodConfig[mood]);
  }, [mood]);

  const getAnimation = () => {
    switch (config.animation) {
      case "breathing":
        return {
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.9, 0.7],
          transition: { duration: 3, repeat: Infinity },
        };
      case "ripple":
        return {
          scale: [1, 1.1, 1],
          opacity: [0.8, 0.4, 0.8],
          transition: { duration: 2, repeat: Infinity },
        };
      case "sparkle":
        return {
          scale: [1, 1.08, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 1.5, repeat: Infinity },
        };
      case "dimming":
        return {
          opacity: [0.5, 0.3, 0.5],
          transition: { duration: 4, repeat: Infinity },
        };
      case "vibration":
        return {
          x: [-2, 2, -2, 2, 0],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
        };
      case "glow":
        return {
          scale: [1, 1.15, 1],
          boxShadow: [
            `0 0 20px ${config.color}`,
            `0 0 40px ${config.color}`,
            `0 0 20px ${config.color}`,
          ],
          transition: { duration: 2.5, repeat: Infinity },
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative w-12 h-12 rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.color}, transparent)`,
          border: `2px solid ${config.color}`,
        }}
        animate={getAnimation()}
      >
        <div
          className="absolute inset-2 rounded-full"
          style={{ backgroundColor: config.color, opacity: 0.6 }}
        />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground/70">
          {config.description}
        </span>
      </div>
    </div>
  );
};
