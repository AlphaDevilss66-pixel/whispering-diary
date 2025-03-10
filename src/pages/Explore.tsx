
import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import DiaryCard from "@/components/diary/DiaryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Heart, Zap, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_private: boolean;
  likes: number;
  comments: number;
  tags?: string[];
};

// Popular tags for filter section (we'll implement actual tags later)
const popularTags = [
  "reflection", "growth", "vulnerability", "travel", 
  "friendship", "healing", "courage", "mindfulness"
];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPublicEntries() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('is_private', false)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Transform the data
        const transformedEntries = data.map(entry => ({
          id: entry.id,
          title: entry.title,
          content: entry.content,
          created_at: entry.created_at,
          is_private: entry.is_private,
          likes: entry.likes || 0,
          comments: entry.comments || 0,
          // Add dummy tags for now - we'll implement real tags later
          tags: popularTags.slice(0, Math.floor(Math.random() * 3) + 1)
        }));
        
        setEntries(transformedEntries);
      } catch (error) {
        console.error("Error fetching public entries:", error);
        toast.error("Failed to load public entries");
      } finally {
        setLoading(false);
      }
    }
    
    fetchPublicEntries();
  }, []);
  
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Filter entries based on search and tags
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = 
      selectedTags.length === 0 || 
      (entry.tags && selectedTags.some(tag => entry.tags?.includes(tag)));
    
    return matchesSearch && matchesTags;
  });
  
  // Sort entries based on the selected option
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "popular":
        return b.likes - a.likes;
      case "trending":
        // For trending, we use a combination of recency and popularity
        const aScore = b.likes / ((Date.now() - new Date(a.created_at).getTime()) / 86400000);
        const bScore = a.likes / ((Date.now() - new Date(b.created_at).getTime()) / 86400000);
        return bScore - aScore;
      default:
        return 0;
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold">Explore Diaries</h1>
            <p className="text-gray-600">Discover anonymous stories and experiences from around the world</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-64 glass-card p-6 h-fit sticky top-24">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Sort By</h4>
                <div className="space-y-2">
                  <Button
                    variant={sortBy === "recent" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSortBy("recent")}
                  >
                    <Clock className="h-4 w-4 mr-2" /> Recent
                  </Button>
                  <Button
                    variant={sortBy === "popular" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSortBy("popular")}
                  >
                    <Heart className="h-4 w-4 mr-2" /> Popular
                  </Button>
                  <Button
                    variant={sortBy === "trending" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSortBy("trending")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" /> Trending
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  {sortBy === "recent" && <Clock className="h-4 w-4" />}
                  {sortBy === "popular" && <Heart className="h-4 w-4" />}
                  {sortBy === "trending" && <Zap className="h-4 w-4" />}
                  {sortBy === "recent" && "Recent Entries"}
                  {sortBy === "popular" && "Popular Entries"}
                  {sortBy === "trending" && "Trending Entries"}
                </h3>
                <span className="text-sm text-gray-500">{sortedEntries.length} entries</span>
              </div>
              
              {selectedTags.length > 0 && (
                <div className="mb-6 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">Filtered by:</span>
                  {selectedTags.map(tag => (
                    <Badge
                      key={tag}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs h-auto p-0"
                    onClick={() => setSelectedTags([])}
                  >
                    Clear all
                  </Button>
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-12">Loading entries...</div>
              ) : sortedEntries.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {sortedEntries.map((entry) => (
                    <DiaryCard
                      key={entry.id}
                      id={entry.id}
                      title={entry.title}
                      content={entry.content}
                      date={entry.created_at}
                      likes={entry.likes}
                      comments={entry.comments}
                      isPrivate={entry.is_private}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-card">
                  <h3 className="text-xl font-medium mb-2">No entries found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
