
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  diary_entry_id: string;
  user: {
    username: string;
    avatar_url: string;
    full_name: string;
  } | null;
};

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
      
      // Fetch all comments for this diary entry
      const { data: commentsData, error: commentsError } = await supabase
        .from("diary_comments")
        .select("*")
        .eq("diary_entry_id", diaryEntryId)
        .order("created_at", { ascending: true });

      if (commentsError) throw commentsError;
      
      // For each comment, fetch the user profile separately
      const commentsWithProfiles = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("username, avatar_url, full_name")
            .eq("id", comment.user_id)
            .single();
            
          return {
            ...comment,
            user: profileError ? null : profileData
          } as Comment;
        })
      );
      
      setComments(commentsWithProfiles);
      updateCommentCount(commentsWithProfiles.length);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentAdded = async (newComment: Comment) => {
    try {
      // Increment comment count on diary entry
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
      
      {/* Comment Form */}
      <CommentForm 
        diaryEntryId={diaryEntryId} 
        onCommentAdded={handleCommentAdded} 
      />
      
      {/* Comments List */}
      <CommentList 
        comments={comments} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default CommentSection;
