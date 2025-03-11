
import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import BookInterface from "@/components/diary/BookInterface";
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
      
      <main className="flex-1 pt-16 pb-20">
        <div className="h-[calc(100vh-120px)] relative">
          {/* Book interface for personal entries */}
          <div className="h-full relative">
            <BookInterface 
              entries={filteredDiaries}
              onNewEntry={fetchDiaryEntries}
              onDeleteEntry={handleDeleteEntry}
            />
            
            {/* Search overlay */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 dark:bg-black/50 backdrop-blur-md border-0 shadow-lg"
                />
              </div>
            </div>
            
            {/* Toggle for public entries */}
            <Button
              variant="outline"
              size="sm"
              onClick={togglePublicEntries}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 gap-2 bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-lg"
            >
              {showPublicEntries ? (
                <>
                  <ArrowUp className="h-4 w-4" />
                  <span>Hide Public Entries</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-4 w-4" />
                  <span>View Public Entries</span>
                </>
              )}
            </Button>
          </div>
          
          {/* Public entries drawer */}
          <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1c1c1e] transition-transform duration-500 transform ${showPublicEntries ? 'translate-y-0' : 'translate-y-full'} h-[70vh] z-20 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)] overflow-hidden`}>
            <div className="h-2 w-16 mx-auto bg-gray-300 dark:bg-gray-700 rounded-full my-3"></div>
            
            <div className="p-6">
              <h2 className="text-2xl font-serif font-medium mb-4">Community Diary Entries</h2>
              <p className="text-gray-500 mb-6">Discover entries shared by others</p>
              
              <div className="overflow-auto max-h-[calc(70vh-120px)] pr-2">
                <div className="grid gap-6">
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
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
