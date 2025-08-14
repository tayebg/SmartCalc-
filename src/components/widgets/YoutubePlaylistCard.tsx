import { useState, useEffect } from "react";
import { Play, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import playlistThumbnail from "@/assets/playlist-thumbnail.jpg";

interface MediaData {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  type: 'playlist' | 'video';
}

interface YoutubePlaylistCardProps {
  url: string;
  title?: string;
}

export function YoutubePlaylistCard({ url, title }: YoutubePlaylistCardProps) {
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Extract playlist ID or video ID from URL
  const extractMediaInfo = (url: string): { id: string; type: 'playlist' | 'video' } | null => {
    // Check for playlist first
    const playlistMatch = url.match(/[?&]list=([^&]+)/);
    if (playlistMatch) {
      return { id: playlistMatch[1], type: 'playlist' };
    }
    
    // Check for video ID
    const videoMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/);
    if (videoMatch) {
      return { id: videoMatch[1], type: 'video' };
    }
    
    // Check for channel URLs and other invalid formats - return null to filter them out
    if (url.includes('youtube.com/c/') || url.includes('youtube.com/@') || url.includes('youtube.com/channel/')) {
      return null;
    }
    
    return null;
  };

  useEffect(() => {
    const mediaInfo = extractMediaInfo(url);
    if (!mediaInfo) {
      setError(true);
      setLoading(false);
      return;
    }

    // Use provided title or fallback
    const mediaTitle = title || `${mediaInfo.type === 'playlist' ? 'Playlist' : 'Video'} ${mediaInfo.id.substring(0, 8)}...`;
    
    // Generate appropriate thumbnail
    const thumbnail = mediaInfo.type === 'video' 
      ? `https://img.youtube.com/vi/${mediaInfo.id}/mqdefault.jpg`
      : playlistThumbnail; // Use fallback for playlists
    
    const fallbackData: MediaData = {
      id: mediaInfo.id,
      title: mediaTitle,
      thumbnail: thumbnail,
      url: url,
      type: mediaInfo.type
    };

    // Simulate quick loading for now
    setTimeout(() => {
      setMediaData(fallbackData);
      setLoading(false);
    }, 100);
  }, [url, title]);

  const handleCardClick = () => {
    if (mediaData) {
      window.open(mediaData.url, '_blank', 'noopener,noreferrer');
    }
  };

  const truncateTitle = (title: string, maxLength: number = 50) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (loading) {
    return (
      <div className="flex-shrink-0 w-72 rounded-lg overflow-hidden border bg-card shadow-sm">
        <Skeleton className="aspect-video w-full" />
        <div className="p-3">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !mediaData) {
    return (
      <div className="flex-shrink-0 w-72 rounded-lg overflow-hidden border bg-card shadow-sm opacity-50">
        <div className="aspect-video bg-muted flex items-center justify-center">
          <ExternalLink className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="p-3">
          <p className="text-sm text-muted-foreground">Unable to load media</p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex-shrink-0 w-72 rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={mediaData.thumbnail}
          alt={mediaData.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            // Try alternative thumbnail formats for videos
            const img = e.currentTarget as HTMLImageElement;
            if (mediaData.type === 'video') {
              if (img.src.includes('mqdefault')) {
                img.src = `https://img.youtube.com/vi/${mediaData.id}/hqdefault.jpg`;
              } else if (img.src.includes('hqdefault')) {
                img.src = `https://img.youtube.com/vi/${mediaData.id}/maxresdefault.jpg`;
              } else {
                img.src = playlistThumbnail; // Final fallback
              }
            } else {
              img.src = playlistThumbnail; // Fallback for playlists
            }
          }}
        />
        {/* Static play icon for non-hover state */}
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 opacity-80">
          <Play className="h-3 w-3 text-white fill-white" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
          {truncateTitle(mediaData.title)}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {mediaData.type === 'playlist' ? 'YouTube Playlist' : 'YouTube Video'}
        </p>
      </div>
    </div>
  );
}