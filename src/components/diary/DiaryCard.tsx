
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Share2, Clock, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DiaryCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  isPrivate: boolean;
  className?: string;
}

const DiaryCard = ({
  id,
  title,
  content,
  date,
  likes,
  comments,
  isPrivate,
  className,
}: DiaryCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Truncate content if too long
  const truncatedContent = content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content;
  
  return (
    <div className={cn("diary-card p-6 flex flex-col", className)}>
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" /> 
          {formattedDate}
        </Badge>
        {isPrivate ? (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Lock className="h-3 w-3" /> 
            Private
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Globe className="h-3 w-3" /> 
            Public
          </Badge>
        )}
      </div>
      
      <Link 
        to={`/diary/${id}`} 
        className="group flex-1"
      >
        <h3 className="text-xl font-serif font-medium mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{truncatedContent}</p>
      </Link>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("p-0 h-auto", liked && "text-red-500")} 
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4 mr-1", liked && "fill-red-500")} />
            <span className="text-xs">{likeCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto" 
            asChild
          >
            <Link to={`/diary/${id}#comments`}>
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">{comments}</span>
            </Link>
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DiaryCard;
