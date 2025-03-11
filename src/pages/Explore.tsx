import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Hash, Flame, Calendar, Sparkles, X } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import DiaryCard from "@/components/diary/DiaryCard";
import { supabase } from "@/integrations/supabase/client";
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

type Tag = {
  name: string;
  count: number;
};

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(searchParams.get("tag"));
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  
  useEffect(() => {
    fetchDiaryEntries();
    fetchPopularTags();
  }, [selectedTag]);

  const fetchDiaryEntries = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('diary_entries')
        .select("*")
        .eq('is_private', false)
        .order('created_at', { ascending: false });
      
      if (selectedTag) {
        query = query.ilike('content', `%#${selectedTag}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching diary entries:", error);
        toast.error("Failed to load diary entries");
        return;
      }
      
      setDiaryEntries(data || []);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
      toast.error("Something went wrong while loading diary entries");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('content')
        .eq('is_private', false);
      
      if (error) {
        console.error("Error fetching tag data:", error);
        return;
      }
      
      const hashtagRegex = /#(\w+)/g;
      const hashtags: Record<string, number> = {};
      
      data?.forEach(entry => {
        const matches = [...entry.content.matchAll(hashtagRegex)];
        matches.forEach(match => {
          if (match[1]) {
            const tag = match[1].toLowerCase();
            hashtags[tag] = (hashtags[tag] || 0) + 1;
          }
        });
      });
      
      const sortedTags = Object.entries(hashtags)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      setPopularTags(sortedTags);
    } catch (error) {
      console.error("Error fetching popular tags:", error);
    }
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const filtered = diaryEntries.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setDiaryEntries(filtered);
    toast.info(`Found ${filtered.length} results for "${searchTerm}"`);
    
    if (!searchTerm) {
      fetchDiaryEntries();
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      setDiaryEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      toast.success("Entry deleted successfully");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-serif font-semibold">Explore</h1>
              <p className="text-muted-foreground">Discover diary entries from the community</p>
            </div>
            
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search diary entries"
                  className="pl-10 pr-12 rounded-full border-muted w-full md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-7 px-3"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <Tabs defaultValue="trending" className="w-full ios-tabs mb-6">
                <TabsList className="mb-4 ios-tabs-list rounded-xl">
                  <TabsTrigger value="trending" className="ios-tab">
                    <Flame className="h-4 w-4 mr-2" />
                    <span>Trending</span>
                  </TabsTrigger>
                  <TabsTrigger value="latest" className="ios-tab">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Latest</span>
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="ios-tab">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Popular</span>
                  </TabsTrigger>
                </TabsList>
                
                {selectedTag && (
                  <div className="mb-4 flex items-center">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Hash className="h-4 w-4 mr-1" />
                      {selectedTag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2 hover:bg-transparent"
                        onClick={() => handleTagSelect(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">
                      Showing entries with tag #{selectedTag}
                    </span>
                  </div>
                )}
                
                <TabsContent value="trending" className="mt-0">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="diary-card p-6 animate-pulse space-y-3">
                          <div className="h-5 w-1/3 bg-muted rounded"></div>
                          <div className="h-6 w-3/4 bg-muted rounded"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded"></div>
                            <div className="h-4 bg-muted rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : diaryEntries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {diaryEntries.map(entry => (
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
                    <div className="text-center py-12 bg-muted rounded-2xl ios-card">
                      <p className="text-muted-foreground">No diary entries found.</p>
                      {selectedTag && (
                        <Button 
                          variant="link" 
                          onClick={() => handleTagSelect(null)}
                          className="mt-2"
                        >
                          Clear tag filter
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="latest" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!loading && diaryEntries.map(entry => (
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
                </TabsContent>
                
                <TabsContent value="popular" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!loading && 
                      [...diaryEntries]
                        .sort((a, b) => b.likes - a.likes)
                        .map(entry => (
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
                        ))
                    }
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="ios-card p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Hash className="h-4 w-4 mr-2" />
                  Popular Tags
                </h3>
                
                {popularTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant={selectedTag === tag.name ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleTagSelect(tag.name)}
                      >
                        #{tag.name}
                        <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No tags found in entries.</p>
                )}
              </div>
              
              <div className="ios-card p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </h3>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      const oneWeekAgo = new Date();
                      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                      const filtered = diaryEntries.filter(entry => 
                        new Date(entry.created_at) >= oneWeekAgo
                      );
                      setDiaryEntries(filtered);
                      toast.info(`Showing entries from the last week (${filtered.length})`);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    This week
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      const sorted = [...diaryEntries].sort((a, b) => b.likes - a.likes);
                      setDiaryEntries(sorted);
                      toast.info("Entries sorted by most likes");
                    }}
                  >
                    <Flame className="h-4 w-4 mr-2" />
                    Most liked
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => fetchDiaryEntries()}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Reset filters
                  </Button>
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

export default Explore;
