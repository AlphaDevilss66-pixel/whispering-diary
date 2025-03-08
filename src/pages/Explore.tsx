
import { useState } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import DiaryCard from "@/components/diary/DiaryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Heart, Zap, TrendingUp } from "lucide-react";

// Mock data for demonstration
const mockEntries = [
  {
    id: "101",
    title: "The Courage to Be Vulnerable",
    content: "Today I shared something I've never told anyone before. The weight I've been carrying for years feels lighter now. It's strange how putting words to our deepest fears can diminish their power over us.",
    date: "2023-09-18T14:30:00Z",
    likes: 142,
    comments: 37,
    isPrivate: false,
    tags: ["vulnerability", "courage", "healing"]
  },
  {
    id: "102",
    title: "Lost and Found in Tokyo",
    content: "I got completely lost in the backstreets of Tokyo yesterday. What started as a moment of panic turned into one of the most memorable experiences of my trip. A kind elderly woman who spoke no English guided me back, communicating purely through gestures and smiles.",
    date: "2023-09-17T08:15:00Z",
    likes: 98,
    comments: 24,
    isPrivate: false,
    tags: ["travel", "kindness", "japan"]
  },
  {
    id: "103",
    title: "The Midnight Epiphany",
    content: "It's funny how clarity often finds us in the quiet hours when the world is asleep. Last night at 2 AM, I suddenly understood what I need to do about the situation that's been troubling me for months. Sometimes we need to stop overthinking and just listen to our intuition.",
    date: "2023-09-16T02:45:00Z",
    likes: 203,
    comments: 42,
    isPrivate: false,
    tags: ["reflection", "decisions", "intuition"]
  },
  {
    id: "104",
    title: "A Letter to My Younger Self",
    content: "If I could write to myself 10 years ago, I'd say: 'The path won't be what you expect, but that's the beauty of it. The detours will lead to people and places you can't imagine now. Trust the journey, even when it feels wrong.'",
    date: "2023-09-15T17:20:00Z",
    likes: 317,
    comments: 58,
    isPrivate: false,
    tags: ["reflection", "growth", "advice"]
  },
  {
    id: "105",
    title: "The Unexpected Friendship",
    content: "We met by chance, disagreed on nearly everything, and somehow became the closest of friends. It's remarkable how differences can either divide or enrich us, depending on our willingness to listen and understand.",
    date: "2023-09-14T11:10:00Z",
    likes: 189,
    comments: 31,
    isPrivate: false,
    tags: ["friendship", "differences", "connection"]
  },
  {
    id: "106",
    title: "When Failure Becomes a Gift",
    content: "The project I poured my heart into for a year has failed. Initially, I was devastated, but now I'm seeing how this apparent failure has opened doors I never would have approached otherwise. Sometimes our greatest setbacks are actually redirections.",
    date: "2023-09-13T15:40:00Z",
    likes: 276,
    comments: 45,
    isPrivate: false,
    tags: ["failure", "resilience", "opportunity"]
  }
];

// Popular tags for filter section
const popularTags = [
  "reflection", "growth", "vulnerability", "travel", 
  "friendship", "healing", "courage", "mindfulness"
];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");
  
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Filter entries based on search and tags
  const filteredEntries = mockEntries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => entry.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  // Sort entries based on the selected option
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "popular":
        return b.likes - a.likes;
      case "trending":
        // For trending, we could use a combination of recency and popularity
        const aScore = b.likes / ((Date.now() - new Date(a.date).getTime()) / 86400000);
        const bScore = a.likes / ((Date.now() - new Date(b.date).getTime()) / 86400000);
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
              
              <div className="grid md:grid-cols-2 gap-6">
                {sortedEntries.map((entry) => (
                  <DiaryCard
                    key={entry.id}
                    id={entry.id}
                    title={entry.title}
                    content={entry.content}
                    date={entry.date}
                    likes={entry.likes}
                    comments={entry.comments}
                    isPrivate={entry.isPrivate}
                  />
                ))}
              </div>
              
              {sortedEntries.length === 0 && (
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
