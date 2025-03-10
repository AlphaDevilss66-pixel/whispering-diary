import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import DiaryForm from "@/components/diary/DiaryForm";
import DiaryCard from "@/components/diary/DiaryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_private: boolean;
  likes: number;
  comments: number;
};

const Dashboard = () => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  
  useEffect(() => {
    async function fetchDiaryEntries() {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('diary_entries')
          .select('id, title, content, created_at, is_private, likes, comments')
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
    }
    
    fetchDiaryEntries();
  }, [user]);
  
  const toggleNewEntry = () => {
    setShowNewEntry(!showNewEntry);
  };
  
  const filteredDiaries = diaryEntries.filter(diary => 
    diary.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    diary.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-serif font-semibold">Your Dashboard</h1>
              <p className="text-gray-600">Manage your diary entries and profile</p>
            </div>
            
            <Button
              onClick={toggleNewEntry}
              className="flex items-center gap-2"
            >
              {showNewEntry ? (
                <>Hide Entry Form</>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>New Entry</span>
                </>
              )}
            </Button>
          </div>
          
          {showNewEntry && (
            <div className="mb-8 animate-slide-up">
              <DiaryForm />
            </div>
          )}
          
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Entries</TabsTrigger>
                <TabsTrigger value="private">Private</TabsTrigger>
                <TabsTrigger value="public">Public</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center w-full md:w-auto gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="all">
              {loading ? (
                <div className="text-center py-12">Loading entries...</div>
              ) : filteredDiaries.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDiaries.map((diary) => (
                    <DiaryCard
                      key={diary.id}
                      id={diary.id}
                      title={diary.title}
                      content={diary.content}
                      date={diary.created_at}
                      likes={diary.likes}
                      comments={diary.comments}
                      isPrivate={diary.is_private}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No entries found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm
                      ? "No entries match your search criteria"
                      : "Start writing your first diary entry"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setShowNewEntry(true)}>
                      Create Your First Entry
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="private">
              {loading ? (
                <div className="text-center py-12">Loading entries...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDiaries
                    .filter(diary => diary.is_private)
                    .map((diary) => (
                      <DiaryCard
                        key={diary.id}
                        id={diary.id}
                        title={diary.title}
                        content={diary.content}
                        date={diary.created_at}
                        likes={diary.likes}
                        comments={diary.comments}
                        isPrivate={diary.is_private}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="public">
              {loading ? (
                <div className="text-center py-12">Loading entries...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDiaries
                    .filter(diary => !diary.is_private)
                    .map((diary) => (
                      <DiaryCard
                        key={diary.id}
                        id={diary.id}
                        title={diary.title}
                        content={diary.content}
                        date={diary.created_at}
                        likes={diary.likes}
                        comments={diary.comments}
                        isPrivate={diary.is_private}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
