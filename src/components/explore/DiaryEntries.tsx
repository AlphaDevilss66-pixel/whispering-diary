
import React from "react";
import DiaryCard from "@/components/diary/DiaryCard";
import { DiaryEntry } from "@/hooks/useDiaryEntries";

type DiaryEntriesProps = {
  entries: DiaryEntry[];
  onDelete: (id: string) => void;
};

const DiaryEntries = ({ entries, onDelete }: DiaryEntriesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {entries.map(entry => (
        <DiaryCard
          key={entry.id}
          id={entry.id}
          title={entry.title}
          content={entry.content}
          date={entry.created_at}
          likes={entry.likes}
          comments={entry.comments}
          isPrivate={entry.is_private}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DiaryEntries;
