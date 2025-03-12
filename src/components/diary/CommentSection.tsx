import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { Comment } from "@/types/database";

interface CommentSectionProps {
  diaryEntryId: string;
  updateCommentCount: (count: number) => void;
}

const CommentSection = ({ diaryEntryId, updateCommentCount }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (diaryEntryId) {
      fetchComments();
    }
  }, [diaryEntryId]);

  const fetchComments = async () => {
    if (!diaryEntryId) return;
    
    try {
      setIsLoading(true);
      const { data: commentsData, error: commentsError } = await supabase
        .from('diary_comments')
        .select('*, profiles:user_id(username, avatar_url, full_name)')
        .eq('diary_entry_id', diaryEntryId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      
      setComments(commentsData as Comment[]);
      updateCommentCount(commentsData.length);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentAdded = async (newComment: Comment) => {
    try {
      const { error: updateError } = await supabase
        .from("diary_entries")
        .update({ comments: comments.length + 1 })
        .eq("id", diaryEntryId);
        
      if (updateError) {
        console.error("Update entry error:", updateError);
        throw updateError;
      }
      
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      updateCommentCount(updatedComments.length);
    } catch (error) {
      console.error("Error updating comment count:", error);
    }
  };

  return (
    <div className="space-y-6 mt-8 pt-8 border-t">
      <h2 className="text-xl font-medium" id="comments">Comments ({comments.length})</h2>
      
      <CommentForm 
        diaryEntryId={diaryEntryId} 
        onCommentAdded={handleCommentAdded} 
      />
      
      <CommentList 
        comments={comments} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default CommentSection;
