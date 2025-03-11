
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Tag = {
  name: string;
  count: number;
};

export const usePopularTags = () => {
  const [popularTags, setPopularTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchPopularTags();
  }, []);

  const fetchPopularTags = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('content')
        .eq('is_private', false);
      
      if (error) {
        console.error("Error fetching tag data:", error);
        return;
      }
      
      const hashtagRegex = /#(\w+)/g;
      const hashtags: Record<string, number> = {};
      
      data?.forEach(entry => {
        const matches = [...entry.content.matchAll(hashtagRegex)];
        matches.forEach(match => {
          if (match[1]) {
            const tag = match[1].toLowerCase();
            hashtags[tag] = (hashtags[tag] || 0) + 1;
          }
        });
      });
      
      const sortedTags = Object.entries(hashtags)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      setPopularTags(sortedTags);
    } catch (error) {
      console.error("Error fetching popular tags:", error);
    }
  };

  return { popularTags };
};
