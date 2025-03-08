
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data as Profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error as Error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return { error };
    }
  };

  return { profile, loading, error, updateProfile };
}
