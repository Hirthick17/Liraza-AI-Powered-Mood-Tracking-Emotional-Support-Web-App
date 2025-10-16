import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, LogOut, BarChart3, Sparkles } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { MoodRing } from "@/components/chat/MoodRing";
import { AvatarPersona } from "@/components/chat/AvatarPersona";
import { PromptCarousel } from "@/components/chat/PromptCarousel";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { VoiceInput } from "@/components/chat/VoiceInput";
import { MoodPicker } from "@/components/chat/MoodPicker";

import {
  analyzeSentiment,
  getAvatarState,
  generatePromptSuggestions,
} from "@/lib/sentiment";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Profile {
  name: string;
  age: number;
  location: string;
  gender: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentMood, setCurrentMood] = useState<
    "calm" | "reflective" | "joyful" | "sad" | "angry" | "healing"
  >("calm");
  const [avatarState, setAvatarState] = useState<
    "listening" | "empathetic" | "encouraging" | "calm" | "distress"
  >("calm");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auth session check
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadMessages();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) setProfile(data);
  };

  const loadMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (data) {
      const loadedMessages = data.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));
      setMessages(loadedMessages);
      updateMoodFromMessages(loadedMessages);
    }
  };

  const updateMoodFromMessages = (msgs: Message[]) => {
    if (msgs.length === 0) return;

    const recentMessages = msgs.slice(-3);
    const combinedText = recentMessages.map((m) => m.content).join(" ");
    const detectedMood = analyzeSentiment(combinedText);

    setCurrentMood(detectedMood);
    setAvatarState(getAvatarState(detectedMood));
    setSuggestions(
      generatePromptSuggestions(
        detectedMood,
        recentMessages.map((m) => m.content)
      )
    );
  };

  const handleSend = async () => {
    if (!input.trim() || !user || !profile) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: input,
    });

    await supabase.from("conversations").insert({
      user_id: user.id,
      message: input,
      role: "user",
      timestamp: new Date().toISOString(),
    });

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { messages: [...messages, userMessage], userProfile: profile },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      updateMoodFromMessages(updatedMessages);

      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "assistant",
        content: data.message,
      });

      await supabase.from("conversations").insert({
        user_id: user.id,
        message: data.message,
        role: "assistant",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSuggestionSelect = (suggestion: any) => setInput(suggestion.text);
  const handleVoiceTranscript = (text: string) => setInput(text);
  const handleMoodSelect = (mood: string, emoji: string) =>
    setInput(`${emoji} I'm feeling ${mood} right now.`);

  const characterName = profile?.gender === "male" ? "Randy" : "Liza";

  // Welcome card auto-hide delay
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <motion.header
        className="border-b-2 border-primary/30 bg-[#FF69B4] sticky top-0 z-10 shadow-lg py-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <h1 className="text-3xl font-bold text-white drop-shadow-md text-center">
            {characterName} — Your AI Companion
          </h1>
          <p className="text-sm text-white/90 italic">
            "You are seen, safe, and supported."
          </p>
        </div>
        <div className="container mx-auto px-4 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MoodRing mood={currentMood} />
            <AvatarPersona name={characterName} state={avatarState} />
          </div>

          <div className="flex items-center gap-5 margin-right: 20px">
            <button
              onClick={() => navigate("/mood")}
              className=" text-white hover:bg-white/20 h-4 w-4 mr-2 flex items-center gap-1 font-medium rounded-md px-2 py-1 text-sm"
            >
              Mood Insights
            </button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto max-w-3xl p-4 flex flex-col h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-y-auto space-y-6 mb-4 px-2 min-h-[65vh]">
          <AnimatePresence mode="popLayout">
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1 }}
              >
                <Card className="p-8 text-center bg-gradient-to-br from-pink-200 via-pink-100 to-white backdrop-blur-md border-2 border-primary/30 shadow-xl">
                  <motion.div
                    className="flex justify-center mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-[var(--shadow-glow)]">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2 text-primary">
                    Welcome back, {profile?.name}!
                  </h2>
                  <p className="text-primary font-medium leading-relaxed text-center">
                    I'm {characterName}, your emotional support companion.
                    Before we begin — how's your heart today? 💖
                  </p>
                </Card>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                role={msg.role}
                content={msg.content}
                index={idx}
              />
            ))}

            {loading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white/95 shadow-md rounded-2xl px-4 py-3 border-2 border-primary/30">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.15,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.3,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {suggestions.length > 0 && (
          <div className="mb-4">
            <PromptCarousel
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
            />
          </div>
        )}

        <motion.div
          className="flex gap-2 items-end"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-2">
            <div className="flex gap-2 [&_button]:bg-[#FF69B4] [&_button]:text-white [&_button]:hover:opacity-90 [&_button]:border-transparent">
              <MoodPicker onMoodSelect={handleMoodSelect} />
              <VoiceInput onTranscript={handleVoiceTranscript} />
            </div>
          </div>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="You can write or say whatever feels heavy..."
            disabled={loading}
            className="rounded-full flex-1 bg-white border-2 border-primary/40 focus:border-primary text-primary placeholder:text-primary/60"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
            className="rounded-full bg-gradient-to-br from-primary to-secondary hover:opacity-90 shadow-md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;
