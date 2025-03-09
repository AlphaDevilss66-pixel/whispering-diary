
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OAuthProvidersProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setFormErrors: (errors: string | null) => void;
}

const OAuthProviders = ({
  isLoading,
  setIsLoading,
  setFormErrors
}: OAuthProvidersProps) => {
  const { signInWithGoogle, signInWithMicrosoft } = useAuth();

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
    <div className="space-y-4">
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
  );
};

export default OAuthProviders;
