import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signInWithEmail = async (email: string, password: string) => {
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

export const signUpWithEmail = async (email: string, password: string) => {
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

export const resetPassword = async (email: string) => {
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

export const signOut = async (
  setSession: (session: null) => void,
  setUser: (user: null) => void,
  navigate: (path: string) => void
) => {
  try {
    // First navigate to prevent any race conditions
    window.location.href = "/";

    // Then clear the local state
    setSession(null);
    setUser(null);
    localStorage.removeItem('supabase.auth.token');

    // Finally sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error && error.message !== "Session not found") {
      console.error("API signout error:", error);
      throw error;
    }

    toast.success("Successfully signed out");
  } catch (error: any) {
    console.error("Error during sign out process:", error);
    toast.error("Error during sign out");
  }
};
