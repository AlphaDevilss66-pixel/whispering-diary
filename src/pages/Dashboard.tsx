
import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import DiaryCard from "@/components/diary/DiaryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter, BookOpen, ArrowDown, ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_private: boolean;
  is_anonymous: boolean;
  likes: number;
  comments: number;
  user_id: string;
};

const Dashboard = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [publicEntries, setPublicEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublicEntries, setShowPublicEntries] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { user } = useAuth();
  
  useEffect(() => {
    fetchDiaryEntries();
    fetchPublicEntries();
  }, [user]);
  
  const fetchDiaryEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setDiaryEntries(data as DiaryEntry[]);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
      toast.error("Failed to load diary entries");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPublicEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) {
        throw error;
      }
      
      setPublicEntries(data as DiaryEntry[]);
    } catch (error) {
      console.error("Error fetching public entries:", error);
    }
  };
  
  const handleDeleteEntry = (id: string) => {
    setDiaryEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };
  
  const filteredDiaries = diaryEntries.filter(diary => 
    diary.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    diary.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const togglePublicEntries = () => {
    setShowPublicEntries(!showPublicEntries);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Diary</h1>
          <Button className="flex items-center gap-2" onClick={() => window.location.href = "/create-entry"}>
            <PlusCircle className="h-4 w-4" />
            New Entry
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              My Entries
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Public Entries
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            {loading ? (
              <div className="text-center py-12">Loading your entries...</div>
            ) : filteredDiaries.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDiaries.map(entry => (
                  <DiaryCard
                    key={entry.id}
                    id={entry.id}
                    title={entry.title}
                    content={entry.content}
                    date={entry.created_at}
                    likes={entry.likes}
                    comments={entry.comments}
                    isPrivate={entry.is_private}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No entries found</h3>
                <p className="text-gray-500 mb-6">Start writing your first diary entry</p>
                <Button onClick={() => window.location.href = "/create-entry"}>
                  Create Your First Entry
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="public">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicEntries.map(entry => (
                <DiaryCard
                  key={entry.id}
                  id={entry.id}
                  title={entry.title}
                  content={entry.content}
                  date={entry.created_at}
                  likes={entry.likes}
                  comments={entry.comments}
                  isPrivate={false}
                  onDelete={() => {}}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
