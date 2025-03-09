
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithPhone, verifyOTP, signInWithGoogle, signInWithMicrosoft } = useAuth();

  const [formErrors, setFormErrors] = useState<string | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors(null);

    try {
      // Basic phone validation
      const phoneRegex = /^\+[1-9]\d{10,14}$/; // International format: +[country code][number]
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error("Inserisci un numero di telefono valido nel formato internazionale (es. +39123456789)");
      }

      const { error } = await signInWithPhone(phoneNumber);
      
      if (error) {
        throw error;
      }
      
      setShowVerification(true);
      toast.success("Codice inviato al tuo telefono");
    } catch (error: any) {
      console.error("Phone verification error:", error);
      setFormErrors(error.message || "Invio codice fallito");
      toast.error("Invio codice fallito");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors(null);

    try {
      const { error } = await verifyOTP(phoneNumber, verificationCode);
      
      if (error) {
        throw error;
      }
      
      toast.success("Accesso effettuato con successo");
      onClose();
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setFormErrors(error.message || "Verifica codice fallita");
      toast.error("Verifica codice fallita");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setFormErrors(null);

    try {
      await signInWithGoogle();
      // Note: Actual redirect is handled by Supabase OAuth flow
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setFormErrors(error.message || "Accesso con Google fallito");
      toast.error("Accesso con Google fallito");
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    setFormErrors(null);

    try {
      await signInWithMicrosoft();
      // Note: Actual redirect is handled by Supabase OAuth flow
    } catch (error: any) {
      console.error("Microsoft sign-in error:", error);
      setFormErrors(error.message || "Accesso con Microsoft fallito");
      toast.error("Accesso con Microsoft fallito");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={onClose}>
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-xl">
            Accedi o Registrati
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {formErrors && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{formErrors}</p>
            </div>
          )}

          {!showVerification ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numero di telefono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+39123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Inserisci il numero in formato internazionale con il prefisso (es. +39)
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  "Ricevi codice"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Codice di verifica</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Inserisci il codice ricevuto"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifica in corso...
                  </>
                ) : (
                  "Verifica codice"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowVerification(false)}
                disabled={isLoading}
              >
                Indietro
              </Button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-gray-500">Oppure continua con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="ios-card border-ios-gray-4"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="#4285F4"
                />
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="#4285F4"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="ios-card border-ios-gray-4"
              onClick={handleMicrosoftSignIn}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                <path
                  d="M0 0h11.377v11.372H0V0zm12.623 0H24v11.372H12.623V0zM0 12.623h11.377V24H0V12.623zm12.623 0H24V24H12.623V12.623z"
                  fill="#00A4EF"
                />
              </svg>
              Microsoft
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Continuando, accetti i nostri{" "}
          <a href="#" className="text-primary hover:underline">
            Termini di Servizio
          </a>{" "}
          e la nostra{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
