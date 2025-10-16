import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, Calendar, TrendingUp, Heart, Sparkles, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { MoodRing } from "@/components/chat/MoodRing";

interface ConversationData {
  message: string;
  sentiment: string;
  timestamp: string;
}

interface MoodAnalysis {
  currentMood: string;
  sentimentDistribution: { positive: number; neutral: number; negative: number };
  insights: string;
  emotionalJourney: string;
}

const Mood = () => {
  const [user, setUser] = useState<User | null>(null);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadMoodLogs();
    loadConversations();
  }, [user]);

  const loadMoodLogs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error loading mood logs:", error);
    } else {
      setMoodLogs(data || []);
    }
  };

  const loadConversations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .select("message, sentiment, timestamp")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error loading conversations:", error);
    } else {
      setConversations(data || []);
    }
  };

  const analyzeMood = async () => {
    if (!user || conversations.length === 0) {
      toast({
        title: "No data available",
        description: "Start chatting to generate mood insights.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    const sentiments = conversations.reduce((acc, conv) => {
      const sent = conv.sentiment?.toLowerCase() || 'neutral';
      acc[sent] = (acc[sent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = conversations.length;
    const distribution = {
      positive: Math.round(((sentiments.positive || 0) / total) * 100),
      neutral: Math.round(((sentiments.neutral || 0) / total) * 100),
      negative: Math.round(((sentiments.negative || 0) / total) * 100),
    };

    let currentMood = "calm";
    if (distribution.positive > 50) currentMood = "joyful";
    else if (distribution.negative > 40) currentMood = "sad";
    else if (distribution.negative > 20 && distribution.negative < 40) currentMood = "reflective";

    const insights = generateInsights(distribution, conversations);
    const emotionalJourney = generateEmotionalJourney(conversations);

    setMoodAnalysis({
      currentMood,
      sentimentDistribution: distribution,
      insights,
      emotionalJourney,
    });

    setIsAnalyzing(false);
  };

  const generateInsights = (distribution: any, conversations: ConversationData[]) => {
    if (distribution.positive > 60) {
      return "Your recent conversations radiate positivity and growth. You're navigating challenges with optimism and resilience.";
    } else if (distribution.negative > 50) {
      return "You've been carrying some heavy emotions lately. It's brave of you to share them. Remember, processing difficult feelings is part of healing.";
    } else {
      return "Your emotional landscape shows balanced complexity - moments of joy mixed with reflection. This balance is a sign of emotional awareness.";
    }
  };

  const generateEmotionalJourney = (conversations: ConversationData[]) => {
    const recentSentiments = conversations.slice(0, 7).map(c => c.sentiment);
    
    if (recentSentiments.filter(s => s === 'Positive').length >= 5) {
      return "Your recent journey has been marked by steady progress and hopeful moments. You're building momentum in a beautiful way.";
    } else if (recentSentiments.filter(s => s === 'Negative').length >= 5) {
      return "The path has felt difficult lately, but every conversation shows your courage to keep moving forward. That strength matters.";
    } else {
      return "You're navigating the natural ebb and flow of emotions with grace. Each conversation deepens your understanding of yourself.";
    }
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      joyful: "hsl(var(--mood-joyful))",
      sad: "hsl(var(--mood-sad))",
      calm: "hsl(var(--mood-calm))",
      reflective: "hsl(var(--mood-reflective))",
      angry: "hsl(var(--mood-angry))",
      healing: "hsl(var(--mood-healing))",
    };
    return colors[mood] || colors.calm;
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)] p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/chat")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <Card className="relative overflow-hidden border-2 border-white/40 bg-white/90 backdrop-blur-sm shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-[pulse_4s_ease-in-out_infinite]" />
          <CardHeader className="text-center relative z-10">
            <div className="flex justify-center mb-4">
              {moodAnalysis && (
                <MoodRing mood={moodAnalysis.currentMood as any} />
              )}
            </div>
            <CardTitle className="text-3xl font-bold gradient-text">
              Your Emotional Landscape
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-primary font-medium">
              {moodAnalysis ? `Currently feeling: ${moodAnalysis.currentMood}` : "Discover your emotional patterns"}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {moodAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/40 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Brain className="h-5 w-5 text-primary" />
                Empathy Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-primary font-medium leading-relaxed">{moodAnalysis.insights}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">{moodAnalysis.sentimentDistribution.positive}%</div>
                  <div className="text-sm text-muted-foreground">Positive</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-600">{moodAnalysis.sentimentDistribution.neutral}%</div>
                  <div className="text-sm text-muted-foreground">Neutral</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-600">{moodAnalysis.sentimentDistribution.negative}%</div>
                  <div className="text-sm text-muted-foreground">Processing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <Card className="bg-pink backdrop-blur-sm border-2 border-white/40 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Emotional Journey
            </CardTitle>
            <CardDescription className="text-primary/80">Your mood patterns over the past days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {moodLogs.slice(0, 28).map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="aspect-square rounded-lg p-2 flex flex-col items-center justify-center text-center relative group cursor-pointer"
                  style={{
                    backgroundColor: `${getMoodColor(log.mood)}20`,
                    border: `2px solid ${getMoodColor(log.mood)}40`,
                  }}
                >
                  <div className="text-xs font-semibold capitalize">{log.mood}</div>
                  <div className="text-[50px] text-muted-foreground mt-1">
                    {new Date(log.created_at).getDate()}
                  </div>
                  
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-popover text-popover-foreground text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {moodAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/40 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Emotional Narrative
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary font-medium leading-relaxed italic">
                "{moodAnalysis.emotionalJourney}"
              </p>
              <div className="mt-6 p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
                <p className="text-sm font-medium text-primary">
                  <Heart className="inline h-4 w-4 mr-2 text-primary" />
                  Remember: Every emotion you experience is a valid part of your journey. You're exactly where you need to be.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <Button
          size="lg"
          onClick={analyzeMood}
          disabled={isAnalyzing || conversations.length === 0}
          className="shadow-[var(--shadow-glow)] bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-105"
        >
          <TrendingUp className="h-5 w-5 mr-2" />
          {isAnalyzing ? "Analyzing..." : moodAnalysis ? "Refresh Analysis" : "Analyze My Mood"}
        </Button>
      </motion.div>
    </div>
  );
};

export default Mood;