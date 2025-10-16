import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

const moods = [
  { emoji: "😊", label: "Happy", mood: "joyful" },
  { emoji: "😌", label: "Calm", mood: "calm" },
  { emoji: "🤔", label: "Thoughtful", mood: "reflective" },
  { emoji: "😔", label: "Sad", mood: "sad" },
  { emoji: "😤", label: "Frustrated", mood: "angry" },
  { emoji: "🌱", label: "Healing", mood: "healing" },
];

interface MoodPickerProps {
  onMoodSelect: (mood: string, emoji: string) => void;
}

export const MoodPicker = ({ onMoodSelect }: MoodPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Smile className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="grid grid-cols-3 gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.mood}
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-accent"
              onClick={() => onMoodSelect(mood.mood, mood.emoji)}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs text-muted-foreground">{mood.label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
