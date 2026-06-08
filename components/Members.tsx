'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'; // ← DAGDAG: animate
import { MemberStats } from '@/app/lib/youtube';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type PlatformType = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'threads';

type SocialLink = {
  platform: PlatformType;
  url: string;
};

type Member = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  subscriberCount: string;
  totalViews?: string;
  description: string;
  socials: SocialLink[];
  giantText: string;
  youtubeChannelId: string;
};

// ─── MEMBER DATA ──────────────────────────────────────────────────────────────
const MEMBERS: Member[] = [
  {
    id: 'von-ordona',
    name: 'Von Ordona',
    role: 'Founder & CEO',
    avatar: '/images/von-ordona.jpg',
    subscriberCount: '7.83M',
    totalViews: '1.2B',
    description:
      'A self-made entrepreneur and the ultimate driving force behind Billionaire Gang. Turning passion into a powerhouse brand, he inspires millions by proving that big dreams coupled with hard work can build an empire.',
    giantText: 'ORDONA',
    youtubeChannelId: 'REPLACE_VON_CHANNEL_ID',
    socials: [
      { platform: 'youtube',   url: 'https://www.youtube.com/@VonOrdonaVlogs' },
      { platform: 'facebook',  url: 'https://www.facebook.com/VonOrdonaOfficial/' },
      { platform: 'instagram', url: 'https://www.instagram.com/vonordona' },
      { platform: 'twitter',   url: 'https://x.com/VonOrdona' },
    ],
  },
  {
    id: 'carlyn-ocampo',
    name: 'Carlyn Ocampo',
    role: 'Co-Host & Creator',
    avatar: '/images/carlyn-ocampo.jpg',
    subscriberCount: '3.09M',
    totalViews: '450M',
    description:
      'A fan-favorite personality and ultimate crowd-pleaser, bringing infectious energy, charm, and effortless humor to the screen. Beyond her bright screen presence, she stands as a powerhouse creator driving creativity and lifestyle content for the community.',
    giantText: 'CARLYN',
    youtubeChannelId: 'REPLACE_CARLYN_CHANNEL_ID',
    socials: [
      { platform: 'youtube',   url: 'https://www.youtube.com/@CarlynOcampo' },
      { platform: 'instagram', url: 'https://www.instagram.com/carlyncabel' },
      { platform: 'facebook',  url: 'https://www.facebook.com/carlyncabel' },
      { platform: 'tiktok',    url: 'https://www.facebook.com/officialcarlynocampo' },
    ],
  },
  {
    id: 'boss-toni',
    name: 'Boss Toni',
    role: 'Creative Director',
    avatar: '/images/boss-toni.jpg',
    subscriberCount: '1.8M',
    totalViews: '210M',
    description:
      'A key personality in the Billionaire Gang circle. Boss Toni brings his own presence, energy, and influence to the group, adding to the brotherhood and entertainment value that fans recognize.',
    giantText: 'B.TONI',
    youtubeChannelId: 'REPLACE_TONI_CHANNEL_ID',
    socials: [
      { platform: 'youtube',   url: 'https://www.youtube.com/@tonibanks' },
      { platform: 'facebook',  url: 'https://www.facebook.com/tonibanksgaming' },
      { platform: 'instagram', url: 'https://www.instagram.com/townilascano' },
      { platform: 'threads',   url: 'https://www.threads.net/@townilascano' },
      { platform: 'tiktok',    url: 'https://www.tiktok.com/@bosstonii' },
    ],
  },
  {
    id: 'laminzu',
    name: 'LaminZu',
    role: 'Content Creator',
    avatar: '/images/laminzu.jpg',
    subscriberCount: '1.92M',
    totalViews: '280M',
    description:
      'The unpredictable spark of Billionaire Gang. LaminZu brings raw humor, street-level energy, and authentic personality to every collab, keeping the gang grounded, funny, and real.',
    giantText: 'LAMINZU',
    youtubeChannelId: 'REPLACE_LAMINZU_CHANNEL_ID',
    socials: [
      { platform: 'youtube',   url: 'https://www.youtube.com/@LaminZuuu' },
      { platform: 'instagram', url: 'https://www.instagram.com/laminzuu' },
      { platform: 'facebook',  url: 'https://www.facebook.com/LaminZuuuu' },
      { platform: 'tiktok',    url: 'https://www.tiktok.com/@laminzuuuu' },
    ],
  },
  {
    id: 'irwin-javier',
    name: 'Irwin Javier',
    role: 'Content Creator',
    avatar: '/images/irwin-javier.jpg',
    subscriberCount: '1.42M',
    totalViews: '195M',
    description:
      'A steady force in the Billionaire Gang lineup. Irwin Javier brings consistency, sharp humor, and a grounded presence that keeps every collab balanced, entertaining, and built to last.',
    giantText: 'IRWIN',
    youtubeChannelId: 'REPLACE_IRWIN_CHANNEL_ID',
    socials: [
      { platform: 'youtube',   url: 'https://www.youtube.com/@IrwinJavier' },
      { platform: 'instagram', url: 'https://www.instagram.com/hmmirwin' },
      { platform: 'facebook',  url: 'https://www.facebook.com/IrwinJavierOfficial' },
      { platform: 'tiktok',    url: 'https://www.tiktok.com/@irwin_javier' },
    ],
  },
  {
    id: 'argonix',
    name: 'ArgoniX',
    role: 'Content Creator',
    avatar: '/images/argonix.jpg',
    subscriberCount: '1.7M',
    totalViews: '220M',
    description:
      'A strong presence in the Billionaire Gang lineup. ArgoniX brings confidence, sharp energy, and entertainment value to every collab, adding power and personality to the group\'s content.',
    giantText: 'ARGONIX',
    youtubeChannelId: 'REPLACE_ARGONIX_CHANNEL_ID',
    socials: [
      { platform: 'youtube',   url: 'https://www.youtube.com/@ArgoniXGaming' },
      { platform: 'instagram', url: 'https://www.instagram.com/argonacosta/' },
      { platform: 'facebook',  url: 'https://www.facebook.com/argon.acosta' },
      { platform: 'tiktok',    url: 'https://www.tiktok.com/@argonix.gaming' },
    ],
  },
];

// ─── SLIDESHOW INTERVAL (ms) ──────────────────────────────────────────────────
const SLIDESHOW_INTERVAL = 10000;

// ─── PLATFORM ICONS ───────────────────────────────────────────────────────────
// FIX: React.ReactElement instead of JSX.Element (deprecated)
const PlatformIcons: Record<PlatformType, React.ReactElement> = {
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  threads: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
      <path d="M427.5 299.7C429.7 300.6 431.7 301.6 433.8 302.5C463 316.6 484.4 337.7 495.6 363.9C511.3 400.4 512.8 459.7 465.3 507.1C429.1 543.3 385 559.6 322.7 560.1L322.4 560.1C252.2 559.6 198.3 536 162 489.9C129.7 448.9 113.1 391.8 112.5 320.3L112.5 319.8C113 248.3 129.6 191.2 161.9 150.2C198.2 104.1 252.2 80.5 322.4 80L322.7 80C393 80.5 447.6 104 485 149.9C503.4 172.6 517 199.9 525.6 231.6L485.2 242.4C478.1 216.6 467.4 194.6 453 177C423.8 141.2 380 122.8 322.5 122.4C265.5 122.9 222.4 141.2 194.3 176.8C168.1 210.1 154.5 258.3 154 320C154.5 381.7 168.1 429.9 194.3 463.3C222.3 498.9 265.5 517.2 322.5 517.7C373.9 517.3 407.9 505.1 436.2 476.8C468.5 444.6 467.9 405 457.6 380.9C451.5 366.7 440.5 354.9 425.7 346C422 372.9 413.9 394.3 401 410.8C383.9 432.6 359.6 444.4 328.3 446.1C304.7 447.4 282 441.7 264.4 430.1C243.6 416.3 231.4 395.3 230.1 370.8C227.6 322.5 265.8 287.8 325.3 284.4C346.4 283.2 366.2 284.1 384.5 287.2C382.1 272.4 377.2 260.6 369.9 252C359.9 240.3 344.3 234.3 323.7 234.2L323 234.2C306.4 234.2 284 238.8 269.7 260.5L235.3 236.9C254.5 207.8 285.6 191.8 323.1 191.8L323.9 191.8C386.5 192.2 423.8 231.3 427.6 299.5L427.4 299.7L427.5 299.7zM271.5 368.5C272.8 393.6 299.9 405.3 326.1 403.8C351.7 402.4 380.7 392.4 385.6 330.6C372.4 327.7 357.8 326.2 342.2 326.2C337.4 326.2 332.6 326.3 327.8 326.6C284.9 329 270.6 349.8 271.6 368.4L271.5 368.5z" />
    </svg>
  ),
};

// ─── PLATFORM TAG ─────────────────────────────────────────────────────────────
function PlatformTag({ platform }: { platform: PlatformType }) {
  const configs: Record<PlatformType, { label: string; classes: string }> = {
    youtube:   { label: 'YouTube',     classes: 'bg-red-950/20 text-red-400 border-red-900/30 hover:bg-red-950/40 hover:border-red-500/50' },
    facebook:  { label: 'Facebook',    classes: 'bg-blue-950/20 text-blue-400 border-blue-900/30 hover:bg-blue-950/40 hover:border-blue-500/50' },
    instagram: { label: 'Instagram',   classes: 'bg-pink-950/20 text-pink-400 border-pink-900/30 hover:bg-pink-950/40 hover:border-pink-500/50' },
    tiktok:    { label: 'TikTok',      classes: 'bg-neutral-950/60 text-neutral-300 border-neutral-700/50 hover:bg-neutral-900 hover:border-neutral-500/70' },
    twitter:   { label: 'Twitter / X', classes: 'bg-neutral-900/40 text-neutral-300 border-neutral-700/30 hover:bg-neutral-800/60 hover:border-neutral-500/50' },
    threads:   { label: 'Threads',     classes: 'bg-neutral-950/60 text-neutral-300 border-neutral-700/50 hover:bg-neutral-900 hover:border-neutral-500/70' },
  };
  const { label, classes } = configs[platform] ?? { label: 'Link', classes: 'bg-neutral-900 text-neutral-400 border-neutral-800' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-200 ${classes}`}>
      {PlatformIcons[platform]}
      {label}
    </span>
  );
}

// ─── PROPS ────────────────────────────────────────────────────────────────────
type MembersProps = {
  liveStats?: Record<string, MemberStats>;
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Members({ liveStats = {} }: MembersProps) {
  const membersWithStats = MEMBERS.map((m) => {
    const live = liveStats[m.youtubeChannelId];
    return {
      ...m,
      subscriberCount: live?.subscriberCount ?? m.subscriberCount,
      totalViews:      live?.totalViews      ?? m.totalViews,
    };
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const textX = useTransform(mouseX, [-300, 300], [-35, 35]);
  const textY = useTransform(mouseY, [-300, 300], [-15, 15]);
  const imgX  = useTransform(mouseX, [-300, 300], [-12, 12]);
  const imgY  = useTransform(mouseY, [-300, 300], [-6,  6]);

  // ─── AUTO SLIDESHOW ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % membersWithStats.length);
    }, SLIDESHOW_INTERVAL);

    return () => clearInterval(timer);
  }, [membersWithStats.length]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width  / 2);
    mouseY.set(e.clientY - rect.top  - rect.height / 2);
  };

  // FIX: use imported `animate` function instead of `motion.animate`
  const handleMouseLeave = () => {
    animate(mouseX, 0, { type: 'spring', stiffness: 60 });
    animate(mouseY, 0, { type: 'spring', stiffness: 60 });
  };

  const syncedActiveMember = membersWithStats[activeIndex];
  const row1 = membersWithStats.slice(0, 3);
  const row2 = membersWithStats.slice(3, 6);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#0A0A0A] text-white min-h-screen py-20 px-6 overflow-hidden flex flex-col justify-between font-sans antialiased select-none"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[160px] pointer-events-none rounded-full" />

      {/* HEADER */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between border-b border-neutral-900 pb-6 relative z-30">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.4em] text-neutral-400 uppercase">
            BG DIRECTORY // CORE INFLUENCE
          </span>
        </div>
      </div>

      {/* MAIN STAGE */}
      <div className="relative w-full max-w-6xl mx-auto my-auto h-[520px] grid grid-cols-1 lg:grid-cols-12 items-center gap-12 z-20">

        {/* LEFT: Stats */}
        <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col justify-center h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={syncedActiveMember.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] font-black tracking-[0.3em] text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-3 py-1 border border-[#D4AF37]/20 rounded-md">
                  {syncedActiveMember.role}
                </span>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mt-4 text-white">
                  {syncedActiveMember.name}
                </h3>
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed font-light max-w-sm">
                {syncedActiveMember.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-900">
                <div>
                  <p className="text-3xl font-black tracking-tight text-white">
                    {syncedActiveMember.subscriberCount}
                  </p>
                  <p className="text-[9px] tracking-widest uppercase text-neutral-600 mt-0.5">
                    Subscribers
                  </p>
                </div>
                {syncedActiveMember.totalViews && (
                  <div>
                    <p className="text-3xl font-black tracking-tight text-neutral-400">
                      {syncedActiveMember.totalViews}
                    </p>
                    <p className="text-[9px] tracking-widest uppercase text-neutral-600 mt-0.5">
                      Total Views
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                {syncedActiveMember.socials.map((social) => (
                  <Link
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    className="hover:scale-105 transition-transform"
                  >
                    <PlatformTag platform={social.platform} />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: Portrait Stage */}
        <div className="lg:col-span-8 order-1 lg:order-2 relative w-full h-full flex items-center justify-center min-h-[350px] lg:min-h-0">

          {/* Giant Text Backdrop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={syncedActiveMember.id}
              style={{ x: textX, y: textY }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute font-black tracking-tighter leading-none text-neutral-900/40 select-none pointer-events-none text-[16vw] lg:text-[130px] xl:text-[160px] text-center z-0 uppercase font-serif"
            >
              {syncedActiveMember.giantText}
            </motion.div>
          </AnimatePresence>

          {/* Portrait */}
          <AnimatePresence mode="wait">
            <motion.div
              key={syncedActiveMember.id}
              style={{ x: imgX, y: imgY }}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.02 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[300px] md:w-[380px] lg:w-[440px] aspect-square z-10 filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] rounded-2xl border border-neutral-800/80 overflow-hidden bg-neutral-950"
            >
              <Image
                src={syncedActiveMember.avatar}
                alt={syncedActiveMember.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 300px, (max-width: 1280px) 380px, 440px"
                quality={100}
                priority
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM SELECTOR — 2 ROWS of 3 */}
      <div className="w-full max-w-3xl mx-auto pt-8 border-t border-neutral-950 relative z-30">
        <p className="text-center text-[9px] font-black tracking-[0.4em] text-neutral-600 uppercase mb-5">
          ✦ TRANSMIT INTEL / SELECT INTEL NETWORK ✦
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {membersWithStats.map((_, i) => (
            <div
              key={i}
              className={`h-[2px] rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-neutral-800'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-900/60 shadow-2xl">
          {[row1, row2].map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-3 gap-2">
              {row.map((member, colIdx) => {
                const memberIndex = rowIdx * 3 + colIdx;
                const isSelected = activeIndex === memberIndex;
                return (
                  <button
                    key={member.id}
                    onClick={() => setActiveIndex(memberIndex)}
                    className={`relative py-4 px-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-neutral-900/30 hover:bg-neutral-900 text-neutral-500 hover:text-neutral-200 border border-transparent hover:border-neutral-800'
                    }`}
                  >
                    <span className={`text-[9px] tracking-widest uppercase font-black ${isSelected ? 'text-black/60' : 'text-neutral-600'}`}>
                      {member.subscriberCount} Subs
                    </span>
                    <span className="text-xs font-black tracking-tight uppercase truncate max-w-full">
                      {member.name.split(' ')[0]}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 inset-x-0 h-[3px] bg-black"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}