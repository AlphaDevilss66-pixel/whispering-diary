
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Share2, Clock, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

  const handleShare = async (platform: string) => {
    const url = `${window.location.origin}/diary/${id}`;
    const title = `Check out this diary entry: ${title}`;
    
    // Different share methods based on platform
    switch (platform) {
      case 'clipboard':
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        } catch (err) {
          console.error("Failed to copy link:", err);
          toast.error("Failed to copy link to clipboard");
        }
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              url: url
            });
          } catch (err) {
            console.error("Error sharing:", err);
          }
        } else {
          toast.error("Sharing is not supported on this device");
        }
    }
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ios-card p-1 min-w-[180px]" align="end">
            <DropdownMenuItem onClick={() => handleShare('clipboard')} className="cursor-pointer rounded-lg focus:bg-secondary">
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer rounded-lg focus:bg-secondary">
              Share on Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer rounded-lg focus:bg-secondary">
              Share on Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer rounded-lg focus:bg-secondary">
              Share on WhatsApp
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DiaryCard;
