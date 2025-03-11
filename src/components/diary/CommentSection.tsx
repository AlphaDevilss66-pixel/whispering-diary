
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

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
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    fetchComments();
  }, [diaryEntryId]);

  const fetchComments = async () => {
    if (!diaryEntryId) return;
    
    try {
      setIsLoading(true);
      // Fix: Use the correct table name and query structure
      const { data, error } = await supabase
        .from("diary_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          diary_entry_id,
          profiles:user_id(username, avatar_url, full_name)
        `)
        .eq("diary_entry_id", diaryEntryId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // Transform data to match our Comment type
      const formattedComments = data.map(comment => ({
        ...comment,
        user: comment.profiles
      })) as Comment[];
      
      setComments(formattedComments);
      updateCommentCount(formattedComments.length);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Insert new comment using the correct table and schema
      const { data, error } = await supabase
        .from("diary_comments")
        .insert({
          content: newComment.trim(),
          user_id: user.id,
          diary_entry_id: diaryEntryId
        })
        .select();

      if (error) throw error;
      
      // Increment comment count on diary entry
      const { error: updateError } = await supabase
        .from("diary_entries")
        .update({ comments: comments.length + 1 })
        .eq("id", diaryEntryId);
        
      if (updateError) throw updateError;
      
      // Add new comment to state with user profile info
      const newCommentWithUser = {
        ...data[0],
        user: {
          username: profile?.username || "",
          avatar_url: profile?.avatar_url || "",
          full_name: profile?.full_name || ""
        }
      };
      
      setComments([...comments, newCommentWithUser as Comment]);
      updateCommentCount(comments.length + 1);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6 mt-8 pt-8 border-t">
      <h2 className="text-xl font-medium" id="comments">Comments ({comments.length})</h2>
      
      {/* Comment Form */}
      {user && (
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(profile?.full_name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="ios-input min-h-[100px] rounded-xl bg-gray-50 border-gray-200"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={isSubmitting || !newComment.trim()}
                className="rounded-xl"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-6">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(comment.user?.full_name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{comment.user?.username || "Anonymous"}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <p className="mt-1 text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
