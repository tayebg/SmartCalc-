import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { YoutubePlaylistCard } from "./YoutubePlaylistCard";
import { cn } from "@/lib/utils";

interface PlaylistCarouselProps {
  playlists: { title: string; url: string }[];
  className?: string;
}

export function PlaylistCarousel({ playlists, className }: PlaylistCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll availability
  const checkScrollAvailability = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Check scroll on mount and when playlists change
  useEffect(() => {
    checkScrollAvailability();
  }, [playlists]);

  // Add scroll event listener
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => checkScrollAvailability();
    scrollElement.addEventListener('scroll', handleScroll);
    
    // Check initial state
    checkScrollAvailability();

    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToDirection = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (playlists.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-muted-foreground">No playlists available</p>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Enhanced fade edges */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-background/60 to-transparent z-20 pointer-events-none transition-opacity duration-200",
        canScrollLeft ? "opacity-100" : "opacity-50"
      )} />
      <div className={cn(
        "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/60 to-transparent z-20 pointer-events-none transition-opacity duration-200",
        canScrollRight ? "opacity-100" : "opacity-50"
      )} />
      
      {/* Left scroll indicator */}
      {canScrollLeft && (
        <button
          onClick={() => scrollToDirection('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full p-2 shadow-md hover:bg-background hover:shadow-lg transition-all duration-200 opacity-80 hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      
      {/* Right scroll indicator */}
      {canScrollRight && (
        <button
          onClick={() => scrollToDirection('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full p-2 shadow-md hover:bg-background hover:shadow-lg transition-all duration-200 opacity-80 hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4 scroll-smooth"
        onScroll={checkScrollAvailability}
      >
        {playlists
          .filter((playlist) => {
            // Filter out channel URLs and other invalid formats
            return !(playlist.url.includes('youtube.com/c/') || 
                    playlist.url.includes('youtube.com/@') || 
                    playlist.url.includes('youtube.com/channel/'));
          })
          .map((playlist, index) => (
            <YoutubePlaylistCard key={index} url={playlist.url} title={playlist.title} />
          ))}
      </div>
    </div>
  );
}