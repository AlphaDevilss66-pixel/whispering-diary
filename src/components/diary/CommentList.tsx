
import { Loader2 } from "lucide-react";
import CommentItem from "./CommentItem";

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

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

const CommentList = ({ comments, isLoading }: CommentListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-6 rounded-3xl">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        Loading comments...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 rounded-3xl">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl overflow-hidden">
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
