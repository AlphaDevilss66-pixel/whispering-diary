import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useSprings, animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const AnimatedDiv = animated(motion.div);

interface BookInterfaceProps {
  pages: React.ReactNode[];
  className?: string;
  onPageChange?: (pageIndex: number) => void;
  initialPage?: number;
  showControls?: boolean;
  allowDrag?: boolean;
  coverImage?: string;
  title?: string;
  author?: string;
}

const BookInterface: React.FC<BookInterfaceProps> = ({
  pages,
  className,
  onPageChange,
  initialPage = 0,
  showControls = true,
  allowDrag = true,
  coverImage,
  title,
  author
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const totalPages = pages.length;
  
  // Handle page change
  useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPage);
    }
  }, [currentPage, onPageChange]);
  
  // Book opening animation
  const openBook = async () => {
    if (isOpen) return;
    
    setIsOpen(true);
    await controls.start({
      rotateY: 180,
      transition: { duration: 1, ease: "easeInOut" }
    });
  };
  
  // Book closing animation
  const closeBook = async () => {
    if (!isOpen) return;
    
    await controls.start({
      rotateY: 0,
      transition: { duration: 1, ease: "easeInOut" }
    });
    setIsOpen(false);
    setCurrentPage(0);
  };
  
  // Page turning logic
  const goToPage = (pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= totalPages || isFlipping) return;
    
    setIsFlipping(true);
    setCurrentPage(pageIndex);
    
    // Prevent rapid page turns
    setTimeout(() => {
      setIsFlipping(false);
    }, 500);
  };
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };
  
  // Spring animation for pages
  const [props, api] = useSprings(totalPages, (index) => ({
    from: {
      rotateY: 0,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      zIndex: totalPages - index,
    },
    to: {
      rotateY: currentPage > index ? 180 : 0,
      boxShadow: currentPage > index 
        ? '0 5px 15px rgba(0,0,0,0.05)' 
        : '0 10px 20px rgba(0,0,0,0.1)',
      zIndex: currentPage > index 
        ? index 
        : totalPages - index,
    },
    config: { mass: 5, tension: 500, friction: 80 },
  }));
  
  // Drag gesture for page turning
  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (!allowDrag || isFlipping) return;
    
    if (active && Math.abs(mx) > 50) {
      if (mx > 0 && currentPage > 0) {
        cancel();
        prevPage();
      } else if (mx < 0 && currentPage < totalPages - 1) {
        cancel();
        nextPage();
      }
    }
  });
  
  // Cover animation
  const coverSpring = useSpring({
    rotateY: isOpen ? 180 : 0,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  
  return (
    <div className={cn("relative w-full h-full flex items-center justify-center perspective-1000", className)}>
      {/* Book container */}
      <div 
        ref={bookRef}
        className="relative w-full max-w-2xl aspect-[3/4] book-shadow"
      >
        {/* Cover */}
        <AnimatedDiv
          style={{
            ...coverSpring,
            transformStyle: 'preserve-3d',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: isOpen ? 0 : totalPages + 1,
            backgroundImage: coverImage ? `url(${coverImage})` : 'linear-gradient(145deg, #2c3e50, #34495e)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px 0 0 8px',
          }}
          onClick={() => isOpen ? closeBook() : openBook()}
          className="cursor-pointer"
        >
          {/* Front cover */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              color: 'white',
              textAlign: 'center',
              borderRadius: '8px 0 0 8px',
            }}
          >
            <h1 className="text-3xl font-bold mb-4">{title || "My Diary"}</h1>
            {author && <p className="text-lg opacity-80">{author}</p>}
            <div className="mt-8 text-sm opacity-70">Click to open</div>
          </div>
          
          {/* Back of cover */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundColor: '#f8f9fa',
              borderRadius: '0 8px 8px 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
            }}
          >
            <div className="text-center text-gray-500">
              <p>First page</p>
            </div>
          </div>
        </AnimatedDiv>
        
        {/* Pages */}
        {props.map((style, index) => {
          // Call bind() once and store the result
          const bindProps = bind();
          
          return (
            <AnimatedDiv
              key={index}
              {...bindProps}
              style={{
                ...style,
                transformStyle: 'preserve-3d',
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                borderRadius: '0 8px 8px 0',
                display: isOpen ? 'block' : 'none',
              }}
            >
              {/* Front of page */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  padding: '2rem',
                  backgroundColor: '#fff',
                  borderRadius: '0 8px 8px 0',
                  overflowY: 'auto',
                }}
              >
                {pages[index]}
              </div>
              
              {/* Back of page */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  padding: '2rem',
                  backgroundColor: '#fff',
                  borderRadius: '0 8px 8px 0',
                  overflowY: 'auto',
                }}
              >
                {index < totalPages - 1 ? pages[index + 1] : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <p>End of diary</p>
                  </div>
                )}
              </div>
            </AnimatedDiv>
          );
        })}
      </div>
      
      {/* Navigation controls */}
      {showControls && isOpen && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className={`p-2 rounded-full bg-white/80 shadow-md ${
              currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <div className="bg-white/80 px-4 py-2 rounded-full shadow-md">
            {currentPage + 1} / {totalPages}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className={`p-2 rounded-full bg-white/80 shadow-md ${
              currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
      
      {/* Close button when book is open */}
      {isOpen && (
        <button
          onClick={closeBook}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 shadow-md hover:bg-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default BookInterface;
