
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_private: boolean;
  is_anonymous: boolean;
  likes: number;
  comments: number;
  user_id: string;
};

type UseDiaryEntriesOptions = {
  selectedTag?: string | null;
  userId?: string | null;
  publicOnly?: boolean;
  limit?: number;
};

export const useDiaryEntries = (options: UseDiaryEntriesOptions = {}) => {
  const { selectedTag = null, userId = null, publicOnly = false, limit = 50 } = options;
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiaryEntries();
  }, [selectedTag, userId, publicOnly]);

  const fetchDiaryEntries = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('diary_entries')
        .select("*")
        .order('created_at', { ascending: false })
        .limit(limit);
      
      // Filter by user ID if provided
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      // Filter by public/private status
      if (publicOnly) {
        query = query.eq('is_private', false);
      }
      
      // Filter by tag if provided
      if (selectedTag) {
        query = query.ilike('content', `%#${selectedTag}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching diary entries:", error);
        toast.error("Failed to load diary entries");
        return;
      }
      
      setDiaryEntries(data || []);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
      toast.error("Something went wrong while loading diary entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      fetchDiaryEntries();
      return 0;
    }
    
    const filtered = diaryEntries.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setDiaryEntries(filtered);
    return filtered.length;
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setDiaryEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      toast.success("Entry deleted successfully");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  const sortByLikes = () => {
    const sorted = [...diaryEntries].sort((a, b) => b.likes - a.likes);
    setDiaryEntries(sorted);
  };

  const filterLastWeek = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const filtered = diaryEntries.filter(entry => 
      new Date(entry.created_at) >= oneWeekAgo
    );
    setDiaryEntries(filtered);
    return filtered.length;
  };

  return {
    diaryEntries,
    loading,
    fetchDiaryEntries,
    handleSearch,
    handleDeleteEntry,
    sortByLikes,
    filterLastWeek
  };
};
