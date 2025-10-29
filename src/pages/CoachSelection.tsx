import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Users, ArrowLeft, Trophy } from "lucide-react";

// Mock data for coaches
const coaches = [
  {
    id: "1",
    name: "Marie Dubois",
    avatar: "MD",
    specialties: ["Perte de poids", "Nutrition", "Remise en forme"],
    location: "Paris 15ème",
    rating: 4.9,
    clientCount: 12,
    maxClients: 15,
    available: true,
    experience: "5 ans d'expérience"
  },
  {
    id: "2",
    name: "Thomas Martin",
    avatar: "TM",
    specialties: ["Musculation", "Performance", "Prise de masse"],
    location: "Lyon 6ème",
    rating: 4.8,
    clientCount: 14,
    maxClients: 15,
    available: true,
    experience: "8 ans d'expérience"
  },
  {
    id: "3",
    name: "Sophie Laurent",
    avatar: "SL",
    specialties: ["Yoga", "Pilates", "Bien-être"],
    location: "Marseille",
    rating: 5.0,
    clientCount: 10,
    maxClients: 12,
    available: true,
    experience: "6 ans d'expérience"
  },
  {
    id: "4",
    name: "Alexandre Petit",
    avatar: "AP",
    specialties: ["CrossFit", "HIIT", "Performance"],
    location: "Toulouse",
    rating: 4.7,
    clientCount: 15,
    maxClients: 15,
    available: false,
    experience: "7 ans d'expérience"
  }
];

const CoachSelection = () => {
  const navigate = useNavigate();

  const handleSelectCoach = (coachId: string) => {
    // In a real app, this would save the coach selection
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/pricing")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Choisissez votre coach
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nos coachs sont sélectionnés pour leur expertise et leur engagement
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coaches.map((coach) => (
            <Card
              key={coach.id}
              className="glass-card border-border/50 hover-scale overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${coach.name}`} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg font-bold">
                      {coach.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{coach.name}</CardTitle>
                      {coach.available ? (
                        <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                          Disponible
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Complet</Badge>
                      )}
                    </div>

                    <CardDescription className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{coach.rating}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {coach.experience}
                      </span>
                    </CardDescription>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {coach.location}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {coach.clientCount}/{coach.maxClients} clients
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Spécialités</h4>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-primary/50 text-primary"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className={`w-full ${
                    coach.available
                      ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      : ""
                  }`}
                  disabled={!coach.available}
                  onClick={() => handleSelectCoach(coach.id)}
                >
                  {coach.available ? "Choisir ce coach" : "Places complètes"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendation Card */}
        <Card className="glass-card border-border/50 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Recommandation
            </CardTitle>
            <CardDescription>
              Nous avons pré-sélectionné des coachs correspondant à vos objectifs
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default CoachSelection;