
import { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Lock, 
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type DiaryCardProps = {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  isPrivate: boolean;
  onDelete: (id: string) => void;
};

const DiaryCard = ({
  id,
  title,
  content,
  date,
  likes,
  comments,
  isPrivate,
  onDelete
}: DiaryCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Entry deleted successfully");
      onDelete(id);
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="diary-card relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-serif font-medium">{title}</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your diary entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 rounded-full"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p className="text-sm text-gray-500">
          {format(new Date(date), "MMMM d, yyyy")}
        </p>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 whitespace-pre-wrap">{content}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-500">
            <Heart className="h-4 w-4" />
            <span className="text-sm">{likes}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{comments}</span>
          </button>
        </div>
        
        {isPrivate && (
          <div className="flex items-center text-gray-500">
            <Lock className="h-4 w-4" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DiaryCard;
