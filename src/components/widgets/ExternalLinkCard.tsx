import { useState, useEffect } from "react";
import { ExternalLink, Globe, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LinkData {
  title: string;
  favicon: string;
  url: string;
  isTelegram: boolean;
}

interface ExternalLinkCardProps {
  url: string;
  title: string;
}

export function ExternalLinkCard({ url, title }: ExternalLinkCardProps) {
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const isTelegram = url.includes('t.me') || url.includes('telegram');
    
    // Extract domain for favicon
    let domain = '';
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname;
    } catch {
      domain = 'unknown';
    }

    const linkInfo: LinkData = {
      title,
      favicon: isTelegram 
        ? `https://ui-avatars.com/api/?name=T&background=0088cc&color=fff&size=64&bold=true`
        : `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      url,
      isTelegram
    };

    // Simulate loading
    setTimeout(() => {
      setLinkData(linkInfo);
      setLoading(false);
    }, 100);
  }, [url, title]);

  const handleCardClick = () => {
    if (linkData) {
      window.open(linkData.url, '_blank', 'noopener,noreferrer');
    }
  };

  const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (loading) {
    return (
      <div className="flex-shrink-0 w-48 rounded-lg overflow-hidden border bg-card shadow-sm">
        <div className="p-4 flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div className="flex-shrink-0 w-48 rounded-lg overflow-hidden border bg-card shadow-sm opacity-50">
        <div className="p-4 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Globe className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Unable to load</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex-shrink-0 w-48 rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="p-4 flex items-center space-x-3">
        <div className="relative flex-shrink-0">
          <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            {linkData.isTelegram ? (
              <MessageCircle className="h-6 w-6 text-blue-500" />
            ) : (
              <img
                src={linkData.favicon}
                alt={linkData.title}
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.innerHTML = '<svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
                  }
                }}
              />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
            <ExternalLink className="h-2.5 w-2.5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
            {truncateTitle(linkData.title)}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {linkData.isTelegram ? 'Telegram Group' : 'Website'}
          </p>
        </div>
      </div>
    </div>
  );
}