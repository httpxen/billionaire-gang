// app/page.tsx

import Hero from '../components/Hero';
import ContentHub from '../components/ContentHub';
import Members from '../components/Members';

import { getLatestVideo, getChannelStats, getAllVideos, getMultipleChannelStats } from '../app/lib/youtube';

export const revalidate = 3600;

// ─── MEMBER CHANNEL IDS ───────────────────────────────────────────────────────
// ⚠️  Replace each value with the real UCxxxxxxxx YouTube channel ID.
// To find IDs, open their channel URL in browser → View Page Source → search "channelId"
// Or use the API: https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=HANDLE&key=YOUR_KEY
const MEMBER_CHANNEL_IDS: Record<string, string> = {
  'von-ordona':    'UCh37Bo2jqQrwrk1JNjpu50g',
  'carlyn-ocampo': 'UC7m88_dfniONQbHF7sxycqg',
  'boss-toni':     'UCYbZ3T9sjdeHUSPmluw8A3g',
  'laminzu':       'UCDAvyoyRWJeYd1_KH3jLpGA',
  'irwin-javier':  'UCWjz4Q8Dtj5tA_fk9-jCShg',
  'argonix':       'UCQ04w5EHOenBuMp2L5xPLCA',
};

export default async function Home() {
  const channelIds = Object.values(MEMBER_CHANNEL_IDS);

  const [latestVideo, channelStats, allVideos, rawMemberStats] = await Promise.all([
    getLatestVideo(),
    getChannelStats(),
    getAllVideos(200),
    getMultipleChannelStats(channelIds),
  ]);

  // Remap: youtubeChannelId → stats
  // (Members.tsx uses youtubeChannelId as the key to look up stats)
  // rawMemberStats is already keyed by channelId, so pass it directly.
  const liveStats = rawMemberStats;

  return (
    <main className="min-h-screen bg-black text-white">
      <Hero
        latestVideo={latestVideo}
        channelStats={channelStats}
      />
      <ContentHub videos={allVideos} />
      <Members liveStats={liveStats} />

      <footer className="border-t border-white/10 py-16 text-center text-sm text-white/50">
        <p>© 2026 Billionaire Gang. All Rights Reserved.</p>
      </footer>
    </main>
  );
}