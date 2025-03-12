
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess: () => void;
  setFormErrors: (errors: string | null) => void;
  switchToRegister: () => void;
  switchToResetPassword: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri")
});

const LoginForm = ({
  isLoading,
  setIsLoading,
  onSuccess,
  setFormErrors,
  switchToRegister,
  switchToResetPassword
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithEmail } = useAuth();

  const validateInputs = () => {
    try {
      loginSchema.parse({ email, password });
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    setFormErrors(null);

    try {
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        // Check specifically for email not confirmed error
        if (error.message === "Email not confirmed") {
          setFormErrors("Email non confermata. Per favore controlla la tua casella di posta e clicca sul link di conferma.");
        } else {
          throw error;
        }
      } else {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setFormErrors(error.message || "Accesso fallito");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
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
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <button 
            type="button" 
            className="text-xs text-ios-blue hover:underline" 
            onClick={switchToResetPassword}
            disabled={isLoading}
          >
            Password dimenticata?
          </button>
        </div>
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

      <Button type="submit" className="w-full ios-button" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Accesso in corso...
          </>
        ) : (
          "Accedi"
        )}
      </Button>

      <div className="text-center text-sm">
        Non hai un account?{" "}
        <button 
          type="button" 
          className="text-ios-blue hover:underline"
          onClick={switchToRegister}
          disabled={isLoading}
        >
          Registrati
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
