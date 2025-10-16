import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, BarChart3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroCharacter from "@/assets/hero-character.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(330,100%,50%)] via-[hsl(312,97%,55%)] to-[hsl(312,100%,50%)]">
      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-3xl"
          animate={{ y: [0, -15, 0], x: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="p-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-[var(--shadow-glow)] animate-float">
              <Sparkles className="w-16 h-16 text-[hsl(330,85%,55%)]" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-lg"
          >
            Meet Your AI Companion
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto font-light"
          >
            Liraza provides 24/7 emotional support, mood tracking, and personalized guidance
            to help you navigate life's challenges
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-6 justify-center mb-16"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-[hsl(330,85%,55%)] hover:bg-white/90 transition-all text-lg px-10 py-6 rounded-full shadow-[var(--shadow-float)] font-medium"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-10 py-6 rounded-full bg-white border-white/30 text-[hsl(330,85%,55%)] hover:bg-white/20 font-medium"
            >
              Learn More
            </Button>
          </motion.div>
          
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            src={heroCharacter}
            alt="Liraza AI Companions"
            className="w-full max-w-3xl mx-auto rounded-3xl shadow-[var(--shadow-float)] animate-float-slow"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-lg"
          >
            Everything You Need for Emotional Wellness
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-[var(--shadow-float)] hover:scale-105 transition-all"
            >
              <div className="p-4 bg-gradient-to-br from-[hsl(330,85%,65%)] to-[hsl(340,97%,43%)] rounded-2xl w-fit mb-6 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[hsl(330,100%,54%)]">AI Chat Support</h3>
              <p className="text-[hsl(330,25%,40%)] leading-relaxed">
                Chat with Randy or Liza, your personal AI companions who provide empathetic,
                real-time emotional support whenever you need it
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-[var(--shadow-float)] hover:scale-105 transition-all"
            >
              <div className="p-4 bg-gradient-to-br from-[hsl(330,85%,65%)] to-[hsl(340,90%,75%)] rounded-2xl w-fit mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[hsl(330,100%,54%)]">Mood Tracking</h3>
              <p className="text-[hsl(330,25%,40%)] leading-relaxed">
                Track your emotional patterns over time with daily mood logs and gain insights
                into your mental health journey
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-[var(--shadow-float)] hover:scale-105 transition-all"
            >
              <div className="p-4 bg-gradient-to-br from-[hsl(330,85%,65%)] to-[hsl(340,90%,75%)] rounded-2xl w-fit mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[hsl(330,100%,54%)]">Personalized Care</h3>
              <p className="text-[hsl(330,25%,40%)] leading-relaxed">
                Receive daily tips and encouragement tailored to your unique needs and
                emotional wellness goals
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center shadow-[var(--shadow-float)]"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[hsl(330,100%,54%)]">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-10 text-[hsl(330,25%,40%)]">
            Join thousands of users who have found comfort and support with Liraza
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-[hsl(330,85%,65%)] to-[hsl(340,90%,75%)] hover:opacity-90 text-white text-lg px-12 py-6 rounded-full shadow-[var(--shadow-glow)] font-medium"
          >
            Create Your Account
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/30 py-8 relative z-10">
        <div className="container mx-auto px-4 text-center text-white/80">
          <p className="font-light">© 2024 Liraza. Your trusted AI companion for emotional wellness.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
