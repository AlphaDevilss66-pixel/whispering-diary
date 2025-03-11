
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
    // First, clear the local state and storage
    setSession(null);
    setUser(null);
    localStorage.removeItem('supabase.auth.token');

    // Then try to sign out from Supabase
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("API signout error:", error);
        if (error.message !== "Session not found") {
          throw error;
        }
      }
    } catch (signOutError) {
      console.error("Error during API signout:", signOutError);
    }
    
    // Always show success message and navigate, even if API call fails
    toast.success("Successfully signed out");
    
    // Force navigation to root with a slight delay to ensure state is cleared
    setTimeout(() => {
      navigate("/");
      window.location.href = "/";
    }, 100);
  } catch (error: any) {
    console.error("Error during sign out process:", error);
    toast.error("Error during sign out");
    
    // Still try to navigate on error
    navigate("/");
    window.location.href = "/";
  }
};
