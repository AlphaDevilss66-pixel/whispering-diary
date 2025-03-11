
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, Image, Lock, EyeOff, Mic, Hash, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type DiaryFormProps = {
  onComplete?: () => void;
};

const DiaryForm = ({ onComplete }: DiaryFormProps = {}) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a diary entry");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('diary_entries')
        .insert({
          title,
          content,
          is_private: isPrivate,
          is_anonymous: isAnonymous,
          user_id: user.id
        });
        
      if (error) throw error;
      
      toast.success("Diary entry published successfully!");
      setTitle("");
      setContent("");
      
      if (onComplete) {
        onComplete();
      } else {
        // Redirect to dashboard to see the new entry
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Error publishing diary entry:", error);
      toast.error("Failed to publish diary entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 book-page bg-white dark:bg-[#1c1c1e] p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-medium text-balance">New Diary Page</h2>
        
        {onComplete && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={onComplete} 
            className="rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <p className="text-gray-500 text-sm font-serif italic">Write your thoughts on this new page</p>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="title" className="font-serif text-base">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title..."
            className="transition-all duration-200 focus:ring-primary/20 font-serif text-lg border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0"
            required
          />
        </div>
        
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="write" className="font-serif">Write</TabsTrigger>
            <TabsTrigger value="record" className="font-serif">Record</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="space-y-4">
            <div>
              <Label htmlFor="content" className="font-serif text-base">Your thoughts</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts here..."
                className="min-h-[200px] transition-all duration-200 focus:ring-primary/20 font-serif text-lg leading-relaxed placeholder:text-gray-400 placeholder:font-serif border-0 bg-transparent p-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer font-serif">
                <Image className="h-4 w-4" />
                <span>Add an image</span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="record" className="space-y-4">
            <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md p-6">
              <Mic className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center mb-4 font-serif">Click to start recording your voice note</p>
              <Button type="button" variant="outline" className="font-serif">Start Recording</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <Switch
            id="private"
            checked={isPrivate}
            onCheckedChange={setIsPrivate}
          />
          <Label htmlFor="private" className="flex items-center gap-2 font-serif">
            <Lock className="h-4 w-4" />
            <span>Private entry</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
            disabled={!isPrivate}
          />
          <Label 
            htmlFor="anonymous" 
            className={`flex items-center gap-2 font-serif ${isPrivate ? "" : "text-gray-400"}`}
          >
            <EyeOff className="h-4 w-4" />
            <span>Share anonymously</span>
          </Label>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full sm:w-auto flex items-center gap-2 font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Posting..." : (
          <>
            <Send className="h-4 w-4" />
            <span>Post Entry</span>
          </>
        )}
      </Button>
    </form>
  );
};

export default DiaryForm;
