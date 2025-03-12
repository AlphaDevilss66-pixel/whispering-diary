
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

interface RegisterFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess: () => void;
  setFormErrors: (errors: string | null) => void;
  switchToLogin: () => void;
}

const registerSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"]
});

const RegisterForm = ({
  isLoading,
  setIsLoading,
  onSuccess,
  setFormErrors,
  switchToLogin
}: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signUpWithEmail } = useAuth();

  const validateInputs = () => {
    try {
      registerSchema.parse({ email, password, confirmPassword });
      return true;
    } catch (error: any) {
      if (error.errors?.[0]?.message) {
        setFormErrors(error.errors[0].message);
      } else {
        setFormErrors("Verifica i dati inseriti");
      }
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    setFormErrors(null);

    try {
      const { error, data } = await signUpWithEmail(email, password);
      
      if (error) {
        throw error;
      } else {
        // Show a clear message after successful registration
        setFormErrors(null);
        onSuccess();
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormErrors(error.message || "Registrazione fallita");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
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

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Registrazione in corso...
          </>
        ) : (
          "Registrati"
        )}
      </Button>

      <div className="text-center text-sm">
        Hai già un account?{" "}
        <button 
          type="button" 
          className="text-ios-blue hover:underline"
          onClick={switchToLogin}
          disabled={isLoading}
        >
          Accedi
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
