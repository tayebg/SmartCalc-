import { useState, useEffect } from "react";
import { ExternalLink, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelData {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

interface YoutubeChannelCardProps {
  url: string;
  title: string;
}

export function YoutubeChannelCard({ url, title }: YoutubeChannelCardProps) {
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Extract channel handle or ID from URL
  const extractChannelInfo = (url: string): { handle?: string; id?: string } => {
    const handleMatch = url.match(/@([^/?&]+)/);
    const idMatch = url.match(/channel\/([^/?&]+)/);
    const userMatch = url.match(/user\/([^/?&]+)/);
    
    if (handleMatch) return { handle: handleMatch[1] };
    if (idMatch) return { id: idMatch[1] };
    if (userMatch) return { handle: userMatch[1] };
    
    return {};
  };

  useEffect(() => {
    const channelInfo = extractChannelInfo(url);
    
    // For now, create fallback data since we don't have YouTube API
    const fallbackData: ChannelData = {
      id: channelInfo.handle || channelInfo.id || 'unknown',
      title: title.replace('@', ''),
      thumbnail: `https://ui-avatars.com/api/?name=${encodeURIComponent(title.replace('@', ''))}&background=random&color=fff&size=128`,
      url: url
    };

    // Simulate loading
    setTimeout(() => {
      setChannelData(fallbackData);
      setLoading(false);
    }, 100);
  }, [url, title]);

  const handleCardClick = () => {
    if (channelData) {
      window.open(channelData.url, '_blank', 'noopener,noreferrer');
    }
  };

  const truncateTitle = (title: string, maxLength: number = 15) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (loading) {
    return (
      <div className="flex-shrink-0 w-40 rounded-lg overflow-hidden border bg-card shadow-sm">
        <div className="p-4 flex flex-col items-center space-y-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !channelData) {
    return (
      <div className="flex-shrink-0 w-40 rounded-lg overflow-hidden border bg-card shadow-sm opacity-50">
        <div className="p-4 flex flex-col items-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground text-center">Unable to load</p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex-shrink-0 w-40 rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="p-4 flex flex-col items-center space-y-3">
        <div className="relative">
          <img
            src={channelData.thumbnail}
            alt={channelData.title}
            className="h-16 w-16 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channelData.title)}&background=6366f1&color=fff&size=128`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
            <ExternalLink className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
            {truncateTitle(channelData.title)}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">YouTube Channel</p>
        </div>
      </div>
    </div>
  );
}