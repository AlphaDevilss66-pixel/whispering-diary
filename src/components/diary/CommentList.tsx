
import { Loader2 } from "lucide-react";
import CommentItem from "./CommentItem";
import { Comment } from "@/types/database";

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

const CommentList = ({ comments, isLoading }: CommentListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-6 font-medium">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <span className="text-gray-600 font-serif">Loading comments...</span>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 font-serif italic">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden">
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
