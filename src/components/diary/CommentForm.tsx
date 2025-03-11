
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommentFormProps {
  diaryEntryId: string;
  onCommentAdded: (comment: any) => void;
}

const CommentForm = ({ diaryEntryId, onCommentAdded }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Insert new comment
      const { data, error } = await supabase
        .from("diary_comments")
        .insert({
          content: newComment.trim(),
          user_id: user.id,
          diary_entry_id: diaryEntryId
        })
        .select();

      if (error) {
        console.error("Insert comment error:", error);
        throw error;
      }
      
      // Add new comment to state with user profile info
      const newCommentWithUser = {
        ...data[0],
        user: {
          username: profile?.username || "",
          avatar_url: profile?.avatar_url || "",
          full_name: profile?.full_name || ""
        }
      };
      
      onCommentAdded(newCommentWithUser);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-muted/40 rounded-xl p-4 text-center">
        Please <Button variant="link" onClick={() => navigate('/login')} className="px-1 h-auto">log in</Button> to leave a comment.
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={profile?.avatar_url || ""} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(profile?.full_name || "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Add a comment... (use #hashtags to categorize)"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="ios-input min-h-[100px] rounded-xl bg-gray-50 border-gray-200 dark:bg-ios-dark-elevated"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmitComment} 
            disabled={isSubmitting || !newComment.trim()}
            className="rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
