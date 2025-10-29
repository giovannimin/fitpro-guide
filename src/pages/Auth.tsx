
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Mail, Lock, User, Phone, Calendar, Eye, EyeOff, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * ===========================================
 * COMPOSANT AUTH - PAGE D'AUTHENTIFICATION
 * ===========================================
 *
 * Gère toutes les méthodes d'authentification :
 * - Email/Mot de passe (Login + Signup)
 * - OAuth (Google, Facebook, Apple)
 * - SMS (Supabase Phone Auth)
 * - Réinitialisation mot de passe
 */

const Auth = () => {
  // ============================================
  // ÉTAT LOCAL
  // ============================================

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'sms'>('email');

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
  });

  const [smsData, setSmsData] = useState({
    phone: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [emailToVerify, setEmailToVerify] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  // ============================================
  // HANDLERS
  // ============================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSmsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmsData({ ...smsData, [e.target.name]: e.target.value });
  };

  // ============================================
  // VALIDATION
  // ============================================

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 40) return "Faible";
    if (strength < 70) return "Moyen";
    return "Fort";
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/[\s.-]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '+33' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('+')) {
      cleaned = '+33' + cleaned;
    }
    return cleaned;
  };

  // ============================================
  // AUTHENTIFICATION EMAIL
  // ============================================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Email non vérifié",
          description: "Veuillez vérifier votre boîte mail.",
          variant: "destructive",
        });
        setEmailToVerify(formData.email);
        setLoading(false);
        return;
      }

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur FitCoach Pro !",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect";
      }
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: "Conditions non acceptées",
        description: "Veuillez accepter les conditions d'utilisation",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    const strength = getPasswordStrength(formData.password);
    if (strength < 40) {
      toast({
        title: "Mot de passe trop faible",
        description: "Utilisez au moins 8 caractères avec majuscules, minuscules et chiffres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            birth_date: formData.birthDate,
          },
        },
      });

      if (error) throw error;

      setEmailToVerify(formData.email);
      toast({
        title: "Compte créé !",
        description: "Vérifiez votre email pour activer votre compte.",
      });
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message.includes("User already registered")) {
        errorMessage = "Cet email est déjà utilisé";
      }
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // OAUTH
  // ============================================

  const handleOAuthLogin = async (provider: "google" | "facebook" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // ============================================
  // AUTHENTIFICATION SMS
  // ============================================

  const handleSendOtp = async () => {
    if (!validatePhoneNumber(smsData.phone)) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro valide (ex: 06 12 34 56 78)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(smsData.phone);
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: { channel: 'sms' },
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "Code envoyé !",
        description: `Un code a été envoyé au ${smsData.phone}`,
      });
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message.includes("rate limit")) {
        errorMessage = "Trop de tentatives. Réessayez plus tard.";
      }
      toast({
        title: "Erreur d'envoi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (smsData.otp.length !== 6) {
      toast({
        title: "Code invalide",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(smsData.phone);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: smsData.otp,
        type: 'sms',
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur FitCoach Pro !",
        });
        const isNewUser = data.user.created_at === data.user.last_sign_in_at;
        navigate(isNewUser ? "/onboarding" : "/dashboard");
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message.includes("Invalid token")) {
        errorMessage = "Code incorrect ou expiré";
      }
      toast({
        title: "Erreur de vérification",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // MOT DE PASSE OUBLIÉ
  // ============================================

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail",
      });
      setResetPasswordOpen(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!emailToVerify) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToVerify,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) throw error;

      toast({
        title: "Email renvoyé",
        description: "Vérifiez votre boîte mail",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDU
  // ============================================

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 glass-card border-border/50">
        <div className="p-8">
          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 glow-effect animate-glow-pulse">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">FitCoach Pro</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte"}
            </p>
          </div>

          {/* MESSAGE VÉRIFICATION */}
          {emailToVerify && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
              <h3 className="font-semibold text-blue-400 mb-2">✉️ Vérifiez votre email</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Email envoyé à <strong>{emailToVerify}</strong>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full"
              >
                Renvoyer l'email
              </Button>
            </div>
          )}

          {/* ONGLETS EMAIL/SMS */}
          <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as 'email' | 'sms')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                SMS
              </TabsTrigger>
            </TabsList>

            {/* FORMULAIRE EMAIL */}
            <TabsContent value="email">
              <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Jean"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Dupont"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Date de naissance</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {!isLogin && formData.password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[25, 50, 75, 100].map((threshold) => (
                          <div
                            key={threshold}
                            className={`h-1 flex-1 rounded-full ${
                              getPasswordStrength(formData.password) >= threshold
                                ? getPasswordStrengthColor(getPasswordStrength(formData.password))
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Force : {getPasswordStrengthText(getPasswordStrength(formData.password))}
                      </p>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {formData.confirmPassword && (
                      <p className={`text-xs ${formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                        {formData.password === formData.confirmPassword ? '✓ Correspondent' : '✗ Ne correspondent pas'}
                      </p>
                    )}
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                      J'accepte les conditions d'utilisation
                    </label>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
                </Button>
              </form>
            </TabsContent>

            {/* FORMULAIRE SMS */}
            <TabsContent value="sms">
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="smsPhone">Numéro de téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="smsPhone"
                          name="phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={smsData.phone}
                          onChange={handleSmsInputChange}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Format : +33612345678 ou 0612345678
                      </p>
                    </div>

                    <Button
                      onClick={handleSendOtp}
                      disabled={loading || !smsData.phone}
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                    >
                      {loading ? "Envoi..." : "Recevoir le code"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Code de vérification</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="123456"
                        value={smsData.otp}
                        onChange={handleSmsInputChange}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest"
                      />
                      <p className="text-xs text-muted-foreground">
                        Entrez le code reçu par SMS
                      </p>
                    </div>

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || smsData.otp.length !== 6}
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                    >
                      {loading ? "Vérification..." : "Vérifier"}
                    </Button>

                    <Button
                      onClick={() => {
                        setOtpSent(false);
                        setSmsData({ phone: smsData.phone, otp: "" });
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Modifier le numéro
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* OAUTH */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continuez avec</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <Button variant="outline" onClick={() => handleOAuthLogin("google")}>
                Google
              </Button>
              <Button variant="outline" onClick={() => handleOAuthLogin("facebook")}>
                Facebook
              </Button>
              <Button variant="outline" onClick={() => handleOAuthLogin("apple")}>
                Apple
              </Button>
            </div>
          </div>

          {/* TOGGLE LOGIN/SIGNUP */}
          <div className="mt-6 text-center text-sm">
            {isLogin ? (
              <>
                <span className="text-muted-foreground">Pas encore de compte ? </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                <span className="text-muted-foreground">Déjà un compte ? </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Se connecter
                </button>
              </>
            )}
          </div>

          {/* MOT DE PASSE OUBLIÉ */}
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setResetPasswordOpen(true)}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* MODAL MOT DE PASSE OUBLIÉ */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre email pour recevoir un lien de réinitialisation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="vous@exemple.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <Button
              onClick={handlePasswordReset}
              disabled={loading || !resetEmail}
              className="w-full"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;