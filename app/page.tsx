import Hero from '../components/Hero';
import ContentHub from '../components/ContentHub';
import Members from '../components/Members';

import { getLatestVideo, getChannelStats, getAllVideos, getMultipleChannelStats } from '../app/lib/youtube';

export const revalidate = 3600;

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

  const liveStats = rawMemberStats;

  return (
    <main className="min-h-screen bg-black text-white">

      <section id="hero">
        <Hero latestVideo={latestVideo} channelStats={channelStats} />
      </section>

      <section id="contenthub">
        <ContentHub videos={allVideos} />
      </section>

      <section id="members">
        <Members liveStats={liveStats} />
      </section>

      <footer className="border-t border-white/10 py-16 text-center text-sm text-white/50">
        <p>© 2026 Billionaire Gang. All Rights Reserved.</p>
      </footer>

    </main>
  );
}