
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hash, X } from "lucide-react";
import { Tag } from "@/hooks/usePopularTags";

type TagFilterProps = {
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  popularTags: Tag[];
};

const TagFilter = ({ selectedTag, onTagSelect, popularTags }: TagFilterProps) => {
  return (
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
              onClick={() => onTagSelect(tag.name)}
            >
              #{tag.name}
              <span className="ml-1 text-xs opacity-70">({tag.count})</span>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No tags found in entries.</p>
      )}

      {selectedTag && (
        <div className="mt-4">
          <Badge variant="outline" className="px-3 py-1">
            <Hash className="h-4 w-4 mr-1" />
            {selectedTag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-2 hover:bg-transparent"
              onClick={() => onTagSelect(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
