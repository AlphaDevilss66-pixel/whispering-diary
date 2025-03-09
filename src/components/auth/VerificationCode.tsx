
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface VerificationCodeProps {
  phoneNumber: string;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onVerified: () => void;
  onBack: () => void;
  setFormErrors: (errors: string | null) => void;
}

const VerificationCode = ({
  phoneNumber,
  isLoading,
  setIsLoading,
  onVerified,
  onBack,
  setFormErrors
}: VerificationCodeProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const { verifyOTP } = useAuth();

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
      onVerified();
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setFormErrors(error.message || "Verifica codice fallita");
      toast.error("Verifica codice fallita");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        onClick={onBack}
        disabled={isLoading}
      >
        Indietro
      </Button>
    </form>
  );
};

export default VerificationCode;
