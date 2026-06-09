// app/lib/youtube.ts

export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  viewCount?: string;
  likeCount?: string;
};

export type ChannelStats = {
  subscriberCount: string;
  totalViews: string;
  videoCount: string;
};

export type VideoWithCategory = YouTubeVideo & {
  categoryTag: string;
};

export type MemberStats = {
  subscriberCount: string;
  totalViews: string;
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatNumber(num: number, isSubscriber = false): string {
  if (isSubscriber) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
    } else if (num >= 10_000) {
      return Math.round(num / 1000) + 'K';
    } else {
      return num.toLocaleString();
    }
  }
  return num.toLocaleString();
}

function detectCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('challenge')) return 'Challenges';
  if (text.includes('vlog')) return 'Vlogs';
  return 'Vlogs';
}

// ─────────────────────────────────────────────
// GET LATEST VIDEO
// ─────────────────────────────────────────────

export async function getLatestVideo(): Promise<YouTubeVideo | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.error('❌ Missing YouTube API credentials');
    return null;
  }

  try {
    console.log('🔄 Fetching latest video from channel:', channelId);

    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&channelId=${channelId}` +
        `&maxResults=1` +
        `&order=date` +
        `&type=video` +
        `&key=${apiKey}`,
      {
        next: { revalidate: 1800 },
        cache: 'force-cache',
      }
    );

    if (!searchRes.ok) {
      console.error(`YouTube Search API error: ${searchRes.status}`);
      return null;
    }

    const searchData = await searchRes.json();

    if (!searchData.items?.length) {
      console.error('No videos found');
      return null;
    }

    const video = searchData.items[0];
    const videoId = video.id.videoId;

    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
        `part=statistics` +
        `&id=${videoId}` +
        `&key=${apiKey}`,
      {
        next: { revalidate: 1800 },
        cache: 'force-cache',
      }
    );

    const statsData = await statsRes.json();
    const statistics = statsData.items?.[0]?.statistics;

    const result: YouTubeVideo = {
      id: videoId,
      title:
        video.snippet.title.length > 60
          ? video.snippet.title.substring(0, 57) + '...'
          : video.snippet.title,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.high?.url || '',
      viewCount: statistics?.viewCount
        ? Number(statistics.viewCount).toLocaleString()
        : undefined,
      likeCount: statistics?.likeCount
        ? Number(statistics.likeCount).toLocaleString()
        : undefined,
    };

    console.log('✅ Latest video fetched:', result.title);
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch latest video:', error);
    return null;
  }
}

// ─────────────────────────────────────────────
// GET CHANNEL STATS
// ─────────────────────────────────────────────

export async function getChannelStats(): Promise<ChannelStats | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.error('❌ Missing YouTube API credentials');
    return null;
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?` +
        `part=statistics` +
        `&id=${channelId}` +
        `&key=${apiKey}`,
      {
        next: { revalidate: 3600 },
        cache: 'force-cache',
      }
    );

    if (!res.ok) {
      console.error(`YouTube Channel Stats API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const stats = data.items?.[0]?.statistics;

    if (!stats) return null;

    const subCount = Number(stats.subscriberCount);
    const viewCount = Number(stats.viewCount);
    const videoCountNum = Number(stats.videoCount);

    return {
      subscriberCount: formatNumber(subCount, true),
      totalViews: formatNumber(viewCount),
      videoCount: formatNumber(videoCountNum),
    };
  } catch (error) {
    console.error('❌ Failed to fetch channel stats:', error);
    return null;
  }
}

// ─────────────────────────────────────────────
// GET MULTIPLE CHANNEL STATS (for Members page)
// ─────────────────────────────────────────────

export async function getMultipleChannelStats(
  channelIds: string[]
): Promise<Record<string, MemberStats>> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || !channelIds.length) return {};

  try {
    const ids = channelIds.join(',');
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?` +
        `part=statistics` +
        `&id=${ids}` +
        `&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error(`❌ Multiple channel stats API error: ${res.status}`);
      return {};
    }

    const data = await res.json();
    const result: Record<string, MemberStats> = {};

    data.items?.forEach((item: any) => {
      const stats = item.statistics;
      const subCount = Number(stats.subscriberCount);
      const viewCount = Number(stats.viewCount);
      result[item.id] = {
        subscriberCount: formatNumber(subCount, true),
        totalViews: formatNumber(viewCount),
      };
    });

    console.log('✅ Multiple channel stats fetched for:', Object.keys(result).length, 'channels');
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch multiple channel stats:', error);
    return {};
  }
}

// ─────────────────────────────────────────────
// GET ALL VIDEOS (via Uploads Playlist — fetches ALL videos, no hidden limit)
// ─────────────────────────────────────────────

export async function getAllVideos(maxResults = 500): Promise<VideoWithCategory[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.error('❌ Missing YouTube API credentials');
    return [];
  }

  try {
    // ── Step 1: Get the uploads playlist ID from the channel ──
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?` +
        `part=contentDetails` +
        `&id=${channelId}` +
        `&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!channelRes.ok) {
      console.error(`Channel API error: ${channelRes.status}`);
      return [];
    }

    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      console.error('❌ Could not find uploads playlist ID');
      return [];
    }

    console.log('✅ Uploads playlist ID:', uploadsPlaylistId);

    // ── Step 2: Page through the uploads playlist ──
    const videos: VideoWithCategory[] = [];
    let pageToken = '';

    do {
      const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
      url.searchParams.set('key', apiKey);
      url.searchParams.set('playlistId', uploadsPlaylistId);
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('maxResults', '50');
      if (pageToken) url.searchParams.set('pageToken', pageToken);

      const playlistRes = await fetch(url.toString(), {
        next: { revalidate: 3600 },
      });

      if (!playlistRes.ok) {
        console.error(`Playlist API error: ${playlistRes.status}`);
        break;
      }

      const playlistData = await playlistRes.json();
      if (!playlistData.items?.length) break;

      // ── Step 3: Batch fetch stats for all videos on this page (1 API call per 50) ──
      const ids = playlistData.items
        .map((item: any) => item.snippet?.resourceId?.videoId)
        .filter(Boolean)
        .join(',');

      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
          `key=${apiKey}` +
          `&id=${ids}` +
          `&part=statistics`,
        { next: { revalidate: 3600 } }
      );

      const statsData = await statsRes.json();

      const statsMap: Record<string, { viewCount: string; likeCount: string }> = {};
      statsData.items?.forEach((item: any) => {
        statsMap[item.id] = {
          viewCount: Number(item.statistics?.viewCount || 0).toLocaleString(),
          likeCount: Number(item.statistics?.likeCount || 0).toLocaleString(),
        };
      });

      // ── Step 4: Build video objects ──
      playlistData.items.forEach((item: any) => {
        const videoId = item.snippet?.resourceId?.videoId;
        if (!videoId) return;

        if (item.snippet.title === 'Deleted video' || item.snippet.title === 'Private video') return;

        const snippet = item.snippet;
        videos.push({
          id: videoId,
          title: snippet.title,
          publishedAt: snippet.publishedAt,
          thumbnail:
            snippet.thumbnails?.maxres?.url ||
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            '',
          viewCount: statsMap[videoId]?.viewCount,
          likeCount: statsMap[videoId]?.likeCount,
          categoryTag: detectCategory(snippet.title, snippet.description || ''),
        });
      });

      console.log(`📄 Fetched ${videos.length} videos so far...`);
      pageToken = playlistData.nextPageToken ?? '';

    } while (pageToken && videos.length < maxResults);

    console.log(`✅ Total fetched: ${videos.length} videos`);
    return videos;

  } catch (error) {
    console.error('❌ Failed to fetch all videos:', error);
    return [];
  }
}