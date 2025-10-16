import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

interface AvatarPersonaProps {
  name: string;
  state: "listening" | "empathetic" | "encouraging" | "calm" | "distress";
}

const stateConfig = {
  listening: {
    expression: "Soft eyes, slight nod",
    animation: "breathing",
    scale: 1,
    glow: 0.1,
  },
  empathetic: {
    expression: "Subtle frown + soft smile",
    animation: "slow",
    scale: 1.02,
    glow: 0.15,
  },
  encouraging: {
    expression: "Bright smile, lean forward",
    animation: "tilt",
    scale: 1.05,
    glow: 0.2,
  },
  calm: {
    expression: "Eyes closed briefly",
    animation: "pulse",
    scale: 1,
    glow: 0.25,
  },
  distress: {
    expression: "Concerned brow",
    animation: "pause",
    scale: 0.98,
    glow: 0.1,
  },
};

export const AvatarPersona = ({ name, state }: AvatarPersonaProps) => {
  const [config, setConfig] = useState(stateConfig[state]);

  useEffect(() => {
    setConfig(stateConfig[state]);
  }, [state]);

  const getAnimation = () => {
    switch (config.animation) {
      case "breathing":
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 3, repeat: Infinity },
        };
      case "slow":
        return {
          scale: [1, 1.01, 1],
          transition: { duration: 4, repeat: Infinity },
        };
      case "tilt":
        return {
          rotate: [0, 2, -2, 0],
          scale: [1, 1.03, 1],
          transition: { duration: 2, repeat: Infinity },
        };
      case "pulse":
        return {
          scale: [1, 1.08, 1],
          opacity: [1, 0.9, 1],
          transition: { duration: 3.5, repeat: Infinity },
        };
      case "pause":
        return {
          scale: 1,
          transition: { duration: 0.5 },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="relative"
      animate={getAnimation()}
      style={{
        filter: `drop-shadow(0 0 ${config.glow * 30}px hsl(var(--primary)))`,
      }}
    >
      <Avatar className="w-16 h-16 border-2 border-primary/20">
        <AvatarImage src="/placeholder.svg" alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <motion.div
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary/80"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};
