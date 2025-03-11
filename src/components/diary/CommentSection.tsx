
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Hash, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      
      // Increment comment count on diary entry
      const { error: updateError } = await supabase
        .from("diary_entries")
        .update({ comments: comments.length + 1 })
        .eq("id", diaryEntryId);
        
      if (updateError) {
        console.error("Update entry error:", updateError);
        throw updateError;
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
      
      const updatedComments = [...comments, newCommentWithUser as Comment];
      setComments(updatedComments);
      updateCommentCount(updatedComments.length);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract hashtags from text
  const extractHashtags = (text: string) => {
    const regex = /#(\w+)/g;
    const matches = text.match(regex) || [];
    return matches.map(tag => tag.substring(1));
  };

  // Handle tag click
  const handleTagClick = (tag: string) => {
    navigate(`/explore?tag=${tag}`);
  };

  // Render content with clickable hashtags
  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const tag = part.substring(1);
        return (
          <span 
            key={index} 
            className="text-primary cursor-pointer font-medium"
            onClick={() => handleTagClick(tag)}
          >
            {part}
          </span>
        );
      }
      return part;
    });
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
      {user ? (
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
      ) : (
        <div className="bg-muted/40 rounded-xl p-4 text-center">
          Please <Button variant="link" onClick={() => navigate('/login')} className="px-1 h-auto">log in</Button> to leave a comment.
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-6">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map(comment => {
            const hashtags = extractHashtags(comment.content);
            
            return (
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
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{renderContentWithHashtags(comment.content)}</p>
                  
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hashtags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs cursor-pointer"
                          onClick={() => handleTagClick(tag)}
                        >
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
