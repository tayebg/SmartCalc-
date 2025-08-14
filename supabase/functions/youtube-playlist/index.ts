import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { playlistId } = await req.json()
    
    if (!playlistId) {
      throw new Error('Playlist ID is required')
    }

    // Get YouTube API key from Supabase secrets
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    // Fetch playlist data from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch playlist data')
    }

    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Playlist not found')
    }

    const playlist = data.items[0]
    const result = {
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      thumbnail: playlist.snippet.thumbnails?.medium?.url || playlist.snippet.thumbnails?.default?.url,
      channelTitle: playlist.snippet.channelTitle,
      publishedAt: playlist.snippet.publishedAt
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 400 
      }
    )
  }
})