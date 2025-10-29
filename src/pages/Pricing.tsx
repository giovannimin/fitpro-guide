import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Check, Dumbbell, Apple, Users, Video, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "training",
    name: "Suivi Entraînement",
    price: 49,
    icon: Dumbbell,
    features: [
      "Programme personnalisé",
      "Suivi hebdomadaire",
      "Messagerie coach",
      "Carnet d'entraînement"
    ]
  },
  {
    id: "nutrition",
    name: "Suivi Alimentation",
    price: 39,
    icon: Apple,
    features: [
      "Programme nutritionnel personnalisé",
      "Liste de courses automatique",
      "Recettes adaptées",
      "Suivi hebdomadaire"
    ]
  },
  {
    id: "complete",
    name: "Entraînement + Alimentation",
    price: 79,
    icon: Users,
    popular: true,
    features: [
      "Tout inclus formules 1 et 2",
      "Suivi complet",
      "Priorité messagerie",
      "Conseils personnalisés"
    ]
  },
  {
    id: "premium",
    name: "Premium + Visio",
    price: 129,
    icon: Video,
    features: [
      "Formule complète",
      "2 séances visio par mois",
      "Suivi premium personnalisé",
      "Disponibilité étendue"
    ]
  }
];

const Pricing = () => {
  const [promoCode, setPromoCode] = useState("");
  const [noSubscribe, setNoSubscribe] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectPlan = (planId: string, price: number) => {
    setSelectedPlan(planId);
    toast({
      title: "Formule sélectionnée",
      description: `Vous avez choisi la formule à ${price}€/mois`,
    });
    // In a real app, this would redirect to Stripe checkout
    setTimeout(() => {
      navigate("/coach-selection");
    }, 1500);
  };

  const handlePromoCode = () => {
    if (promoCode) {
      toast({
        title: "Code promo appliqué",
        description: "Votre réduction a été prise en compte",
      });
    }
  };

  const handleNoSubscribe = () => {
    if (noSubscribe) {
      toast({
        title: "Demande enregistrée",
        description: "Un coach vous contactera bientôt",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Choisissez votre formule
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez la formule qui correspond à vos objectifs et commencez votre transformation
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative glass-card border-border/50 hover-scale ${
                  plan.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-secondary">
                      Populaire
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.popular
                        ? "bg-gradient-to-br from-primary to-secondary glow-effect"
                        : "bg-muted"
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">{plan.price}€</span>
                    <span className="text-muted-foreground">/mois</span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan.id, plan.price)}
                    disabled={selectedPlan !== null}
                  >
                    {selectedPlan === plan.id ? "Sélectionné" : "Choisir"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Promo Code & Options */}
        <Card className="glass-card border-border/50 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Options supplémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="promo">Code promo / Code parrainage</Label>
              <div className="flex gap-2">
                <Input
                  id="promo"
                  placeholder="Entrez votre code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" onClick={handlePromoCode}>
                  Appliquer
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2 p-4 border border-border rounded-lg">
              <Checkbox
                id="no-subscribe"
                checked={noSubscribe}
                onCheckedChange={(checked) => setNoSubscribe(checked as boolean)}
              />
              <label
                htmlFor="no-subscribe"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                Je ne souhaite pas souscrire maintenant mais accepte d'être contacté par un coach
              </label>
            </div>

            {noSubscribe && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleNoSubscribe}
              >
                Être contacté par un coach
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;