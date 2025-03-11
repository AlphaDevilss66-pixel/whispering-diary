
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import SearchBar from "@/components/explore/SearchBar";
import EntryTabs from "@/components/explore/EntryTabs";
import TagFilter from "@/components/explore/TagFilter";
import Filters from "@/components/explore/Filters";
import { useDiaryEntries } from "@/hooks/useDiaryEntries";
import { usePopularTags } from "@/hooks/usePopularTags";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(searchParams.get("tag"));
  const { popularTags } = usePopularTags();
  const { 
    diaryEntries, 
    loading, 
    fetchDiaryEntries, 
    handleSearch, 
    handleDeleteEntry,
    sortByLikes,
    filterLastWeek
  } = useDiaryEntries(selectedTag);

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchSubmit = (searchTerm: string) => {
    const resultsCount = handleSearch(searchTerm);
    if (searchTerm.trim()) {
      toast.info(`Found ${resultsCount} results for "${searchTerm}"`);
    }
  };

  const handleFilterByWeek = () => {
    const count = filterLastWeek();
    toast.info(`Showing entries from the last week (${count})`);
  };

  const handleSortByLikes = () => {
    sortByLikes();
    toast.info("Entries sorted by most likes");
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
            
            <SearchBar onSearch={handleSearchSubmit} />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <EntryTabs 
                loading={loading}
                diaryEntries={diaryEntries}
                selectedTag={selectedTag}
                onDelete={handleDeleteEntry}
                onClearTag={() => handleTagSelect(null)}
              />
            </div>
            
            <div className="w-full lg:w-1/3 space-y-6">
              <TagFilter 
                selectedTag={selectedTag}
                onTagSelect={handleTagSelect}
                popularTags={popularTags}
              />
              
              <Filters 
                onFilterByWeek={handleFilterByWeek}
                onSortByLikes={handleSortByLikes}
                onResetFilters={fetchDiaryEntries}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
