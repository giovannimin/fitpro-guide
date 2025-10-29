import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const questions = [
  {
    id: "personal-info",
    title: "Informations personnelles",
    description: "Parlez-nous un peu de vous",
    fields: [
      { name: "age", label: "Âge", type: "number" },
      { name: "gender", label: "Sexe", type: "radio", options: ["Homme", "Femme", "Autre"] },
      { name: "profession", label: "Profession", type: "text" },
      { name: "activity_level", label: "Niveau d'activité actuel", type: "radio", options: ["Sédentaire", "Actif", "Très actif"] }
    ]
  },
  {
    id: "goals",
    title: "Vos objectifs",
    description: "Que souhaitez-vous atteindre ?",
    fields: [
      { name: "main_goal", label: "Objectif principal", type: "radio", options: ["Perte de poids", "Prise de masse", "Remise en forme", "Performance"] },
      { name: "goal_number", label: "Objectif chiffré (ex: perdre 10kg)", type: "text" },
      { name: "timeline", label: "Délai souhaité", type: "text" }
    ]
  },
  {
    id: "training-habits",
    title: "Habitudes d'entraînement",
    description: "Votre routine actuelle",
    fields: [
      { name: "training_frequency", label: "Fréquence d'entraînement actuelle", type: "radio", options: ["Jamais", "1-2 fois/semaine", "3-4 fois/semaine", "5+ fois/semaine"] },
      { name: "training_location", label: "Lieu d'entraînement préféré", type: "radio", options: ["Salle de sport", "À domicile", "Extérieur", "Mixte"] },
      { name: "equipment", label: "Matériel disponible", type: "textarea" }
    ]
  },
  {
    id: "nutrition",
    title: "Habitudes alimentaires",
    description: "Votre alimentation actuelle",
    fields: [
      { name: "meals_per_day", label: "Nombre de repas par jour", type: "number" },
      { name: "diet_type", label: "Régime alimentaire", type: "radio", options: ["Omnivore", "Végétarien", "Vegan", "Autre"] },
      { name: "allergies", label: "Allergies ou intolérances", type: "textarea" }
    ]
  },
  {
    id: "lifestyle",
    title: "Mode de vie",
    description: "Votre quotidien",
    fields: [
      { name: "sleep_hours", label: "Heures de sommeil moyennes", type: "number" },
      { name: "stress_level", label: "Niveau de stress (1-10)", type: "number", min: 1, max: 10 },
      { name: "motivation", label: "Niveau de motivation (1-10)", type: "number", min: 1, max: 10 }
    ]
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const handleInputChange = (name: string, value: string) => {
    setAnswers({ ...answers, [name]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save answers and redirect
      toast({
        title: "Questionnaire complété !",
        description: "Vos réponses ont été enregistrées",
      });
      navigate("/pricing");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Étape {currentStep + 1} sur {questions.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="glass-card border-border/50 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
            <CardDescription>{currentQuestion.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentQuestion.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>

                {field.type === "text" && (
                  <Input
                    id={field.name}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                )}

                {field.type === "number" && (
                  <Input
                    id={field.name}
                    type="number"
                    min={field.min}
                    max={field.max}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.name}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    rows={3}
                  />
                )}

                {field.type === "radio" && field.options && (
                  <RadioGroup
                    value={answers[field.name] || ""}
                    onValueChange={(value) => handleInputChange(field.name, value)}
                  >
                    {field.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                        <Label htmlFor={`${field.name}-${option}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {currentStep === questions.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Terminer
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;