
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

interface ResetPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess: () => void;
  setFormErrors: (errors: string | null) => void;
  switchToLogin: () => void;
}

const resetSchema = z.object({
  email: z.string().email("Email non valida")
});

const ResetPasswordForm = ({
  isLoading,
  setIsLoading,
  onSuccess,
  setFormErrors,
  switchToLogin
}: ResetPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();

  const validateInputs = () => {
    try {
      resetSchema.parse({ email });
      return true;
    } catch (error: any) {
      if (error.errors?.[0]?.message) {
        setFormErrors(error.errors[0].message);
      } else {
        setFormErrors("Email non valida");
      }
      return false;
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    setFormErrors(null);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        throw error;
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Reset password error:", error);
      setFormErrors(error.message || "Reset password fallito");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
      <div className="text-center mb-4">
        <h2 className="text-lg font-medium">Reset Password</h2>
        <p className="text-sm text-gray-500">
          Inserisci la tua email e ti invieremo un link per reimpostare la password
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="tuaemail@esempio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full ios-button" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Invio in corso...
          </>
        ) : (
          "Invia link di reset"
        )}
      </Button>

      <div className="text-center text-sm">
        <button 
          type="button" 
          className="text-ios-blue hover:underline"
          onClick={switchToLogin}
          disabled={isLoading}
        >
          Torna al login
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
