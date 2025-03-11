
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
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Initial session data:", data.session ? "Session exists" : "No session");
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user && location.pathname === '/') {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error getting auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (event === 'SIGNED_IN') {
          navigate("/dashboard");
        } else if (event === 'SIGNED_OUT') {
          navigate("/");
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
      // First check if we actually have a session before attempting to sign out
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.log("No active session found, skipping API call");
        // Just clear local state and redirect
        setSession(null);
        setUser(null);
        navigate("/");
        toast.success("Successfully signed out");
        return;
      }
      
      // We have a session, so clear local session state first
      setSession(null);
      setUser(null);
      
      // Then make the API call
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        // If we get a 403 session_not_found error, we can just ignore it
        // as the user is effectively signed out already
        if (error.message !== "Session not found") {
          throw error;
        }
      }
      
      navigate("/");
      toast.success("Successfully signed out");
    } catch (error: any) {
      console.error("Error during sign out:", error);
      // Still navigate to home page even on error
      navigate("/");
      // Only show error if it's not the "Session not found" error
      if (error.message !== "Session not found") {
        toast.error(error.message || "Error during sign out");
      } else {
        toast.success("Successfully signed out");
      }
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
