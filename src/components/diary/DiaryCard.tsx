import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Share2, Clock, Lock, Globe, Hash, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DiaryCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  isPrivate: boolean;
  className?: string;
  onDelete?: () => void;
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
  onDelete,
}: DiaryCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newLikeStatus = !liked;
    const newLikeCount = newLikeStatus ? likeCount + 1 : likeCount - 1;
    
    setLiked(newLikeStatus);
    setLikeCount(newLikeCount);
    
    try {
      const { error } = await supabase
        .from("diary_entries")
        .update({ likes: newLikeCount })
        .eq("id", id);
        
      if (error) throw error;
      
    } catch (error) {
      console.error("Error updating like count:", error);
      setLiked(!newLikeStatus);
      setLikeCount(liked ? likeCount + 1 : likeCount - 1);
      toast.error("Failed to update like count");
    }
  };

  const handleShare = async (platform: string) => {
    const url = `${window.location.origin}/diary/${id}`;
    const shareTitle = `Check out this diary entry: ${title}`;
    
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
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + url)}`, '_blank');
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title: shareTitle,
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

  const handleDelete = async () => {
    if (!user) {
      toast.error("You must be logged in to delete entries");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("diary_entries")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast.success("Diary entry deleted successfully");
      
      if (onDelete) {
        onDelete();
      } else {
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Error deleting diary entry:", error);
      toast.error("Failed to delete diary entry");
    }
  };

  const extractHashtags = (text: string) => {
    const regex = /#(\w+)/g;
    const matches = text.match(regex) || [];
    return matches.map(tag => tag.substring(1));
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/explore?tag=${tag}`);
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const tag = part.substring(1);
        return (
          <span 
            key={index} 
            className="text-primary cursor-pointer font-medium"
            onClick={(e) => handleTagClick(tag, e)}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };
  
  const truncatedContent = content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content;
  
  const hashtags = extractHashtags(content);
  
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
        <p className="text-gray-600 text-sm mb-4">
          {renderContentWithHashtags(truncatedContent)}
        </p>
        
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {hashtags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs cursor-pointer"
                onClick={(e) => handleTagClick(tag, e)}
              >
                <Hash className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
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
              <span className="text-xs">{commentCount}</span>
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="ios-card">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your diary entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
            <DropdownMenuContent className="ios-card p-1 min-w-[180px] rounded-xl" align="end">
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
    </div>
  );
};

export default DiaryCard;
