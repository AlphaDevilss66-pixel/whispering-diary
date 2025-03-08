
import { useState } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import DiaryForm from "@/components/diary/DiaryForm";
import DiaryCard from "@/components/diary/DiaryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter, BookOpen } from "lucide-react";

// Mock data for demonstration
const mockDiaries = [
  {
    id: "1",
    title: "Finding Peace in Chaos",
    content: "Today I realized that even in the most chaotic moments, there's a certain peace to be found if we look deeply enough. I went for a long walk in the park and just sat by the lake for an hour, watching the ripples on the water.",
    date: "2023-09-15T12:00:00Z",
    likes: 24,
    comments: 5,
    isPrivate: false,
  },
  {
    id: "2",
    title: "Late Night Thoughts",
    content: "It's 2 AM and I can't sleep. My mind is racing with ideas for the future. Sometimes I wonder if I'm on the right path, but then I remember that the journey itself is what matters most.",
    date: "2023-09-10T02:15:00Z",
    likes: 18,
    comments: 3,
    isPrivate: true,
  },
  {
    id: "3",
    title: "A Conversation with a Stranger",
    content: "Had the most fascinating conversation with an elderly man at the coffee shop today. He shared stories from his youth, traveling across Europe in the 1960s. It made me realize how much wisdom surrounds us if we're open to listening.",
    date: "2023-09-05T16:30:00Z",
    likes: 32,
    comments: 7,
    isPrivate: false,
  },
  {
    id: "4",
    title: "New Beginnings",
    content: "Today marks the start of something new. I've decided to pursue my passion project full-time. It's scary but exhilarating to finally take this leap of faith.",
    date: "2023-09-01T09:45:00Z",
    likes: 45,
    comments: 12,
    isPrivate: false,
  },
];

const Dashboard = () => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const toggleNewEntry = () => {
    setShowNewEntry(!showNewEntry);
  };
  
  const filteredDiaries = mockDiaries.filter(diary => 
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
              {filteredDiaries.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDiaries.map((diary) => (
                    <DiaryCard
                      key={diary.id}
                      id={diary.id}
                      title={diary.title}
                      content={diary.content}
                      date={diary.date}
                      likes={diary.likes}
                      comments={diary.comments}
                      isPrivate={diary.isPrivate}
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiaries
                  .filter(diary => diary.isPrivate)
                  .map((diary) => (
                    <DiaryCard
                      key={diary.id}
                      id={diary.id}
                      title={diary.title}
                      content={diary.content}
                      date={diary.date}
                      likes={diary.likes}
                      comments={diary.comments}
                      isPrivate={diary.isPrivate}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="public">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiaries
                  .filter(diary => !diary.isPrivate)
                  .map((diary) => (
                    <DiaryCard
                      key={diary.id}
                      id={diary.id}
                      title={diary.title}
                      content={diary.content}
                      date={diary.date}
                      likes={diary.likes}
                      comments={diary.comments}
                      isPrivate={diary.isPrivate}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
