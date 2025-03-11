
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Calendar, Lock, Globe, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CommentSection from "@/components/diary/CommentSection";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  is_private: boolean;
  likes: number;
  comments: number;
  user_id: string;
  author: {
    username: string;
    avatar_url: string;
    full_name: string;
  };
};

const DiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchDiaryEntry() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('diary_entries')
          .select(`
            id, title, content, created_at, is_private, 
            likes, comments, user_id,
            profiles:user_id(username, avatar_url, full_name)
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Transform data to match our DiaryEntry type
        const transformedData = {
          ...data,
          author: data.profiles
        } as unknown as DiaryEntry;
        
        setDiaryEntry(transformedData);
        setLikeCount(data.likes);
      } catch (error) {
        console.error("Error fetching diary entry:", error);
        toast.error("Failed to load diary entry");
      } finally {
        setLoading(false);
      }
    }
    
    fetchDiaryEntry();
  }, [id]);
  
  const handleLike = async () => {
    if (!diaryEntry) return;
    
    const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
    
    setLiked(!liked);
    setLikeCount(newLikeCount);
    
    try {
      const { error } = await supabase
        .from('diary_entries')
        .update({ likes: newLikeCount })
        .eq('id', diaryEntry.id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert UI state if update fails
      setLiked(liked);
      setLikeCount(likeCount);
      toast.error("Failed to update likes");
    }
  };
  
  const updateCommentCount = (count: number) => {
    setCommentCount(count);
  };

  const handleShare = async (platform: string) => {
    if (!diaryEntry) return;
    
    const url = window.location.href;
    const title = `Check out this diary entry: ${diaryEntry.title}`;
    
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
        <div className="page-container max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-6 -ml-2 rounded-xl">
              <Link to="/dashboard" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            {loading ? (
              <div className="ios-card p-8 animate-pulse">
                <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : diaryEntry ? (
              <div className="ios-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={diaryEntry.author?.avatar_url || ""} />
                      <AvatarFallback>{getInitials(diaryEntry.author?.full_name || "")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{diaryEntry.author?.username || "Anonymous"}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 inline" />
                        {format(new Date(diaryEntry.created_at), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      {diaryEntry.is_private ? (
                        <>
                          <Lock className="h-3 w-3" />
                          Private
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3" />
                          Public
                        </>
                      )}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
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
                
                <h1 className="text-3xl font-serif font-semibold mb-4">{diaryEntry.title}</h1>
                
                <div className="text-gray-700 prose max-w-none mb-8 whitespace-pre-wrap">
                  {diaryEntry.content}
                </div>
                
                <div className="border-t pt-6 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 ${liked ? "text-red-500" : ""}`}
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                    <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                  </div>
                </div>
                
                <CommentSection diaryEntryId={diaryEntry.id} updateCommentCount={updateCommentCount} />
              </div>
            ) : (
              <div className="ios-card p-8 text-center">
                <h2 className="text-xl font-medium mb-2">Diary entry not found</h2>
                <p className="text-gray-500 mb-4">The diary entry you're looking for doesn't exist or you don't have permission to view it.</p>
                <Button asChild>
                  <Link to="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiaryDetail;
