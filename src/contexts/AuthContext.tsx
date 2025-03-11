import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signUpWithEmail: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
      
      // If user is logged in and on the landing page, redirect to dashboard
      if (session?.user && location.pathname === '/') {
        navigate("/dashboard");
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
        
        // If user just signed in, redirect to dashboard
        if (event === 'SIGNED_IN') {
          navigate("/dashboard");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (response.error) {
        toast.error(response.error.message);
      }
      
      return response;
    } catch (error: any) {
      toast.error(error.message || "Errore durante l'accesso");
      return { error, data: null };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Email di verifica inviata! Controlla la tua casella di posta.");
      }
      
      return response;
    } catch (error: any) {
      toast.error(error.message || "Errore durante la registrazione");
      return { error, data: null };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Email per il reset della password inviata!");
      }
      
      return response;
    } catch (error: any) {
      toast.error(error.message || "Errore durante il reset della password");
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout effettuato con successo");
    } catch (error: any) {
      toast.error(error.message || "Errore durante il logout");
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
