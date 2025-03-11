
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Calendar, Sparkles, Hash, X } from "lucide-react";
import DiaryEntries from "@/components/explore/DiaryEntries";
import { DiaryEntry } from "@/hooks/useDiaryEntries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type EntryTabsProps = {
  loading: boolean;
  diaryEntries: DiaryEntry[];
  selectedTag: string | null;
  onDelete: (id: string) => void;
  onClearTag: () => void;
};

const EntryTabs = ({ 
  loading, 
  diaryEntries, 
  selectedTag,
  onDelete,
  onClearTag
}: EntryTabsProps) => {
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="diary-card-transparent p-6 animate-pulse space-y-3">
          <div className="h-5 w-1/3 bg-muted rounded"></div>
          <div className="h-6 w-3/4 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
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
              onClick={onClearTag}
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
          renderSkeletons()
        ) : diaryEntries.length > 0 ? (
          <DiaryEntries entries={diaryEntries} onDelete={onDelete} />
        ) : (
          <div className="text-center py-12 bg-transparent border border-border rounded-2xl">
            <p className="text-muted-foreground">No diary entries found.</p>
            {selectedTag && (
              <Button 
                variant="link" 
                onClick={onClearTag}
                className="mt-2"
              >
                Clear tag filter
              </Button>
            )}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="latest" className="mt-0">
        {!loading && <DiaryEntries entries={diaryEntries} onDelete={onDelete} />}
      </TabsContent>
      
      <TabsContent value="popular" className="mt-0">
        {!loading && (
          <DiaryEntries 
            entries={[...diaryEntries].sort((a, b) => b.likes - a.likes)} 
            onDelete={onDelete} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default EntryTabs;
