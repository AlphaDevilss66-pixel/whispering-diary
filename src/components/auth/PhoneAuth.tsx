
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PhoneAuthProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onVerificationSent: (phoneNumber: string) => void;
  setFormErrors: (errors: string | null) => void;
  formErrors: string | null;
}

const PhoneAuth = ({
  isLoading,
  setIsLoading,
  onVerificationSent,
  setFormErrors,
  formErrors
}: PhoneAuthProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { signInWithPhone } = useAuth();

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
      
      onVerificationSent(phoneNumber);
      toast.success("Codice inviato al tuo telefono");
    } catch (error: any) {
      console.error("Phone verification error:", error);
      setFormErrors(error.message || "Invio codice fallito");
      toast.error("Invio codice fallito");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default PhoneAuth;
