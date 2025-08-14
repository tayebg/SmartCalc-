import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface ScrollableRibbonProps {
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ScrollableRibbon({
  options,
  value,
  onValueChange,
  placeholder,
  className
}: ScrollableRibbonProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll availability
  const checkScrollAvailability = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Auto-scroll to selected item
  useEffect(() => {
    if (value && scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(`[data-value="${value}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [value]);

  // Check scroll on mount and when options change
  useEffect(() => {
    checkScrollAvailability();
  }, [options]);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const scrollToDirection = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll 80% of visible width
    const newScrollLeft = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <div className={cn("relative", className)}>
      {/* Enhanced fade edges with stronger gradients */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background via-background/60 to-transparent z-20 pointer-events-none transition-opacity duration-200",
        canScrollLeft ? "opacity-100" : "opacity-50"
      )} />
      <div className={cn(
        "absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background via-background/60 to-transparent z-20 pointer-events-none transition-opacity duration-200",
        canScrollRight ? "opacity-100" : "opacity-50"
      )} />
      
      {/* Left scroll indicator */}
      {canScrollLeft && (
        <button
          onClick={() => scrollToDirection('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-30 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-1 shadow-md hover:bg-background hover:shadow-lg transition-all duration-200 opacity-70 hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
      
      {/* Right scroll indicator */}
      {canScrollRight && (
        <button
          onClick={() => scrollToDirection('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-30 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-1 shadow-md hover:bg-background hover:shadow-lg transition-all duration-200 opacity-70 hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
      
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-2 overflow-x-auto scrollbar-hide py-2 px-4",
          "cursor-grab active:cursor-grabbing select-none",
          "scroll-smooth"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onScroll={checkScrollAvailability}
        style={{
          scrollSnapType: 'x mandatory'
        }}
      >
        {options.map((option) => (
          <div
            key={option.value}
            data-value={option.value}
            onClick={() => !isDragging && onValueChange(option.value)}
            className={cn(
              "flex-shrink-0 px-4 py-3 rounded-lg border transition-all duration-200",
              "cursor-pointer select-none whitespace-nowrap min-w-fit",
              "hover:shadow-md active:scale-95",
              "scroll-snap-align-center",
              // 3D effect with shadows and borders
              "shadow-sm border-border/50",
              value === option.value
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                : "bg-card hover:bg-accent hover:text-accent-foreground border-border hover:border-accent-foreground/20"
            )}
          >
            <span className="text-sm font-medium">{option.label}</span>
          </div>
        ))}
        
        {options.length === 0 && placeholder && (
          <div className="flex-shrink-0 px-4 py-3 text-muted-foreground text-sm">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}