import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles, Trophy, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 pointer-events-none" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center glow-effect animate-glow-pulse">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="gradient-text">FitCoach Pro</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
              Transformez votre corps avec un coaching personnalisé. 
              Atteignez vos objectifs avec l'aide de coachs certifiés.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-scale-in">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8 glow-effect"
              >
                Commencer maintenant
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="text-lg px-8"
              >
                Se connecter
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="glass-card p-6 rounded-2xl hover-scale">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Programmes Personnalisés</h3>
                <p className="text-muted-foreground">
                  Des plans d'entraînement et de nutrition adaptés à vos objectifs
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl hover-scale">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coachs Certifiés</h3>
                <p className="text-muted-foreground">
                  Accompagnement par des professionnels expérimentés et diplômés
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl hover-scale">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Communauté Active</h3>
                <p className="text-muted-foreground">
                  Partagez votre parcours et motivez-vous avec d'autres membres
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
