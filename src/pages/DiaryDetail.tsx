
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CommentSection from "@/components/diary/CommentSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  ArrowLeft, 
  Calendar, 
  Lock, 
  Globe,
  MoreHorizontal
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_private: boolean;
  is_anonymous: boolean;
  likes: number;
  comments: number;
  user_id: string;
  author?: {
    username: string;
    avatar_url: string;
    full_name: string;
  };
};

const DiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchDiaryEntry = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('diary_entries')
          .select(`
            *,
            author:profiles(username, avatar_url, full_name)
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setEntry(data as DiaryEntry);
        setLikeCount(data.likes);
        setCommentCount(data.comments);
      } catch (error) {
        console.error("Error fetching diary entry:", error);
        toast.error("Failed to load diary entry");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDiaryEntry();
  }, [id, navigate]);
  
  const handleLike = async () => {
    if (!user || !entry) return;
    
    // Update optimistically
    const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
    setLiked(!liked);
    setLikeCount(newLikeCount);
    
    try {
      // Update in database
      const { error } = await supabase
        .from('diary_entries')
        .update({ likes: newLikeCount })
        .eq('id', entry.id);
        
      if (error) throw error;
    } catch (error) {
      // Revert on error
      console.error("Error updating likes:", error);
      setLiked(liked);
      setLikeCount(likeCount);
      toast.error("Failed to update likes");
    }
  };
  
  const handleShare = async (platform: string) => {
    if (!entry) return;
    
    const url = `${window.location.origin}/diary/${entry.id}`;
    const title = `Check out this diary entry: ${entry.title}`;
    
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
  
  const updateCommentCount = (count: number) => {
    setCommentCount(count);
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
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="page-container">
          {loading ? (
            <div className="text-center py-20">Loading diary entry...</div>
          ) : !entry ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-medium mb-4">Entry not found</h2>
              <Button onClick={() => navigate(-1)} className="rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </Button>
            </div>
          ) : (
            <div>
              {/* Back button */}
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(-1)}
                  className="text-muted-foreground p-0 hover:text-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> 
                  Back
                </Button>
              </div>
              
              <article className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <Badge variant="outline" className="w-fit flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> 
                        {format(new Date(entry.created_at), "MMMM d, yyyy")}
                      </Badge>
                      {entry.is_private ? (
                        <Badge variant="outline" className="w-fit flex items-center gap-1">
                          <Lock className="h-3 w-3" /> 
                          Private Entry
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="w-fit flex items-center gap-1">
                          <Globe className="h-3 w-3" /> 
                          Public Entry
                        </Badge>
                      )}
                    </div>
                    
                    {user && user.id === entry.user_id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/edit-diary/${entry.id}`)}>
                            Edit Entry
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-serif font-medium mb-4">{entry.title}</h1>
                  
                  {!entry.is_anonymous && entry.author && (
                    <div className="flex items-center gap-2 mb-6">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.author.avatar_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(entry.author.full_name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{entry.author.username || "Anonymous"}</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="prose max-w-none mb-8">
                  {entry.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-800 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between py-4 border-t border-b mb-8">
                  <div className="flex items-center space-x-6">
                    <Button 
                      variant="ghost" 
                      className={`flex items-center gap-2 ${liked ? 'text-red-500' : ''}`}
                      onClick={handleLike}
                    >
                      <Heart className={`h-5 w-5 ${liked ? 'fill-red-500' : ''}`} />
                      <span>{likeCount}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>{commentCount}</span>
                    </Button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" /> 
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="ios-card p-1" align="end">
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
                
                {/* Comments Section */}
                <CommentSection 
                  diaryEntryId={entry.id} 
                  updateCommentCount={updateCommentCount}
                />
              </article>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiaryDetail;
