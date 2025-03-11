
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Calendar, Flame, Sparkles } from "lucide-react";

type FiltersProps = {
  onFilterByWeek: () => void;
  onSortByLikes: () => void;
  onResetFilters: () => void;
};

const Filters = ({ onFilterByWeek, onSortByLikes, onResetFilters }: FiltersProps) => {
  return (
    <div className="ios-card p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </h3>
      
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onFilterByWeek}
        >
          <Calendar className="h-4 w-4 mr-2" />
          This week
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onSortByLikes}
        >
          <Flame className="h-4 w-4 mr-2" />
          Most liked
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onResetFilters}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Reset filters
        </Button>
      </div>
    </div>
  );
};

export default Filters;
