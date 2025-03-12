
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Comment } from "@/types/database";

type CommentItemProps = {
  comment: Comment;
};

const CommentItem = ({ comment }: CommentItemProps) => {
  const navigate = useNavigate();

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

  const hashtags = extractHashtags(comment.content);

  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.user?.avatar_url || ""} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(comment.user?.full_name || "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium">{comment.user?.username || "Anonymous"}</span>
          <span className="text-xs text-gray-500 font-serif italic">
            {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
        <p className="mt-1 text-gray-700 dark:text-gray-300 font-serif text-base leading-relaxed">{renderContentWithHashtags(comment.content)}</p>
        
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hashtags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs cursor-pointer font-serif"
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
};

export default CommentItem;
