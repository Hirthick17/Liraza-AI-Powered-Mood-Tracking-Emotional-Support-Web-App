type Mood = "calm" | "reflective" | "joyful" | "sad" | "angry" | "healing";
type AvatarState = "listening" | "empathetic" | "encouraging" | "calm" | "distress";

const moodKeywords = {
  joyful: ["happy", "excited", "great", "wonderful", "amazing", "love", "joy", "awesome", "fantastic", "excellent"],
  sad: ["sad", "depressed", "down", "lonely", "upset", "hurt", "crying", "hopeless", "miserable", "empty"],
  angry: ["angry", "frustrated", "mad", "annoyed", "irritated", "furious", "rage", "hate", "pissed"],
  calm: ["calm", "peaceful", "relaxed", "content", "serene", "quiet", "tranquil", "easy", "fine", "okay"],
  reflective: ["thinking", "wondering", "confused", "contemplating", "considering", "unsure", "maybe", "perhaps"],
  healing: ["better", "improving", "healing", "growing", "progress", "trying", "working on", "learning"],
};

export function analyzeSentiment(text: string): Mood {
  const lowerText = text.toLowerCase();
  const scores: Record<Mood, number> = {
    calm: 0,
    reflective: 0,
    joyful: 0,
    sad: 0,
    angry: 0,
    healing: 0,
  };

  // Count keyword matches
  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        scores[mood as Mood]++;
      }
    });
  });

  // Find highest score
  let maxMood: Mood = "calm";
  let maxScore = scores.calm;

  Object.entries(scores).forEach(([mood, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxMood = mood as Mood;
    }
  });

  // Default to calm if no clear mood detected
  return maxScore > 0 ? maxMood : "calm";
}

export function getAvatarState(mood: Mood): AvatarState {
  const moodToState: Record<Mood, AvatarState> = {
    calm: "calm",
    reflective: "listening",
    joyful: "encouraging",
    sad: "empathetic",
    angry: "distress",
    healing: "encouraging",
  };

  return moodToState[mood];
}

export function generatePromptSuggestions(mood: Mood, recentMessages: string[]) {
  const basePrompts = {
    sad: [
      { type: "validation" as const, text: "Would you like me to summarize what I heard?", icon: null },
      { type: "empowerment" as const, text: "Shall I help you reframe this thought?", icon: null },
      { type: "rest" as const, text: "Need a short breathing break?", icon: null },
    ],
    angry: [
      { type: "rest" as const, text: "Want to take a moment to breathe together?", icon: null },
      { type: "reflection" as const, text: "Want to talk about what triggered this?", icon: null },
      { type: "action" as const, text: "Would it help to channel this into action?", icon: null },
    ],
    reflective: [
      { type: "reflection" as const, text: "Want to explore this thought deeper?", icon: null },
      { type: "validation" as const, text: "Should I reflect back what you shared?", icon: null },
      { type: "action" as const, text: "Ready to turn this into a small step?", icon: null },
    ],
    joyful: [
      { type: "action" as const, text: "Want to capture this feeling for later?", icon: null },
      { type: "reflection" as const, text: "What's been contributing to this good energy?", icon: null },
      { type: "empowerment" as const, text: "How can we build on this momentum?", icon: null },
    ],
    calm: [
      { type: "reflection" as const, text: "What's been on your mind lately?", icon: null },
      { type: "rest" as const, text: "Would you like to sit in this peace for a moment?", icon: null },
      { type: "action" as const, text: "Want to set a gentle intention for today?", icon: null },
    ],
    healing: [
      { type: "empowerment" as const, text: "What progress are you noticing?", icon: null },
      { type: "action" as const, text: "Ready for the next small step?", icon: null },
      { type: "validation" as const, text: "Should we celebrate how far you've come?", icon: null },
    ],
  };

  return basePrompts[mood] || basePrompts.calm;
}
