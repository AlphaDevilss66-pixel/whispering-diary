import React, { useState, useRef, useEffect } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { DiaryEntry } from "@/hooks/useDiaryEntries";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DiaryForm from "./DiaryForm";

interface BookInterfaceProps {
  entries: DiaryEntry[];
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
}

const BookInterface: React.FC<BookInterfaceProps> = ({ 
  entries,
  onNewEntry,
  onDeleteEntry
}) => {
  const [index, setIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  
  // Create springs for each page
  const [props, api] = useSprings(entries.length || 1, i => ({
    x: i < index ? -100 : i > index ? 100 : 0,
    scale: i === index ? 1 : 0.8,
    display: i < index - 1 || i > index + 1 ? 'none' : 'block',
    opacity: i === index ? 1 : 0.5,
    rotateY: i < index ? -15 : i > index ? 15 : 0,
    config: { mass: 1, tension: 320, friction: 35 }
  }));
  
  // Set up gesture handler for swipe with proper TypeScript typing
  const bind = useDrag(({ active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    const trigger = vx > 0.2;
    const dir = xDir < 0 ? 1 : -1;
    
    // If we're actively dragging and not at boundaries, move the page
    if (active && ((dir === 1 && index < entries.length - 1) || (dir === -1 && index > 0))) {
      api.start(i => {
        if (i < index - 1 || i > index + 1) return { display: 'none' };
        const isGone = active ? trigger : false;
        
        // Calculate x position based on drag
        const x = isGone ? (200 + window.innerWidth) * dir : active ? mx : 0;
        
        // Calculate rotation and scale
        const scale = active ? (1 - Math.abs(mx) / window.innerWidth / 2) : i === index ? 1 : 0.8;
        const rotateY = active ? (mx / 10) : i < index ? -15 : i > index ? 15 : 0;
        
        return {
          x,
          scale,
          rotateY,
          display: 'block',
          opacity: i === index ? 1 : 0.5,
          config: { friction: 50, tension: active ? 800 : 500 }
        };
      });
    } else if (!active && trigger) {
      // If the user released with enough velocity, change page
      const newIndex = index + (dir === 1 ? 1 : -1);
      if (newIndex >= 0 && newIndex < entries.length) {
        setIndex(newIndex);
      }
      
      // Animate all pages to their new positions
      api.start(i => {
        const newIdx = index + (dir === 1 ? 1 : -1);
        if (i < newIdx - 1 || i > newIdx + 1) return { display: 'none' };
        
        return {
          x: i < newIdx ? -100 : i > newIdx ? 100 : 0,
          scale: i === newIdx ? 1 : 0.8,
          rotateY: i < newIdx ? -15 : i > newIdx ? 15 : 0,
          opacity: i === newIdx ? 1 : 0.5,
          display: 'block',
          config: { friction: 50, tension: 500 }
        };
      });
    } else {
      // Reset pages to their resting positions
      api.start(i => {
        if (i < index - 1 || i > index + 1) return { display: 'none' };
        
        return {
          x: i < index ? -100 : i > index ? 100 : 0,
          scale: i === index ? 1 : 0.8,
          rotateY: i < index ? -15 : i > index ? 15 : 0,
          opacity: i === index ? 1 : 0.5,
          display: 'block',
          config: { friction: 50, tension: 500 }
        };
      });
    }
  });
  
  const goToNextPage = () => {
    if (index < entries.length - 1) {
      setIndex(index + 1);
      api.start(i => {
        if (i < index || i > index + 2) return { display: 'none' };
        
        return {
          x: i < index + 1 ? -100 : i > index + 1 ? 100 : 0,
          scale: i === index + 1 ? 1 : 0.8,
          rotateY: i < index + 1 ? -15 : i > index + 1 ? 15 : 0,
          opacity: i === index + 1 ? 1 : 0.5,
          display: 'block',
          config: { friction: 50, tension: 500 }
        };
      });
    }
  };
  
  const goToPrevPage = () => {
    if (index > 0) {
      setIndex(index - 1);
      api.start(i => {
        if (i < index - 2 || i > index) return { display: 'none' };
        
        return {
          x: i < index - 1 ? -100 : i > index - 1 ? 100 : 0,
          scale: i === index - 1 ? 1 : 0.8,
          rotateY: i < index - 1 ? -15 : i > index - 1 ? 15 : 0,
          opacity: i === index - 1 ? 1 : 0.5,
          display: 'block',
          config: { friction: 50, tension: 500 }
        };
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const toggleNewEntryForm = () => {
    setShowForm(!showForm);
  };
  
  // If there are no entries, show the form
  useEffect(() => {
    if (entries.length === 0) {
      setShowForm(true);
    }
  }, [entries]);
  
  return (
    <div className="book-container h-full w-full">
      {/* Navigation buttons */}
      {entries.length > 0 && (
        <>
          <button 
            className={`swipe-indicator swipe-indicator-left ${index === 0 ? 'opacity-30' : 'opacity-80'}`}
            onClick={goToPrevPage}
            disabled={index === 0}
          >
            <ArrowLeft size={20} />
          </button>
          
          <button 
            className={`swipe-indicator swipe-indicator-right ${index === entries.length - 1 ? 'opacity-30' : 'opacity-80'}`}
            onClick={goToNextPage}
            disabled={index === entries.length - 1}
          >
            <ArrowRight size={20} />
          </button>
        </>
      )}
      
      {/* New entry button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-ios-primary text-white"
          onClick={toggleNewEntryForm}
        >
          <Plus size={24} />
        </Button>
      </div>
      
      {/* Show new entry form if requested or if no entries */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-auto rounded-xl">
            <DiaryForm onComplete={() => {
              setShowForm(false);
              onNewEntry();
            }} />
          </div>
        </div>
      )}
      
      {/* Render the book pages */}
      {entries.length > 0 ? (
        <div className="w-full h-full overflow-hidden">
          {props.map(({ x, scale, display, opacity, rotateY }, i) => (
            entries[i] && (
              <animated.div
                key={entries[i].id}
                className="book-page absolute top-0 left-0 w-full h-full"
                style={{
                  display,
                  opacity,
                  transform: x.to(x => `translate3d(${x}%,0,0)`).to(
                    (x) => `translate3d(${x}%,0,0) scale(${scale}) rotateY(${rotateY}deg)`
                  ),
                }}
                {...(bind() as any)}
              >
                <div className="book-page-content overflow-auto h-full">
                  <div className="book-page-date">{formatDate(entries[i].created_at)}</div>
                  <h2 className="book-page-title">{entries[i].title}</h2>
                  <div className="book-page-body whitespace-pre-wrap">
                    {entries[i].content}
                  </div>
                </div>
              </animated.div>
            )
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-serif mb-4">Your diary is empty</h2>
            <p className="text-gray-500 mb-6">Start writing your first entry</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookInterface;

