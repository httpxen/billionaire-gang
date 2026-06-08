'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { VideoWithCategory } from '../app/lib/youtube';

const FILTERS = ['All', 'Vlogs', 'Challenges', 'Announcements', 'Giveaways'];
const PAGE_SIZE = 9;

interface ContentHubProps {
  videos: VideoWithCategory[];
}

// ─── YouTube Icon (always white — visible on any bg) ──────────────────────────
function YouTubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Math.round(size * 0.71)}
      viewBox="0 0 256 180"
      fill="none"
    >
      {/* Red bg only shown on non-hover; on hover parent bg is already red */}
      <rect width="256" height="180" rx="40" fill="currentColor" />
      <path fill="#fff" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
    </svg>
  );
}

// ─── Inline Video Modal ───────────────────────────────────────────────────────
function VideoModal({
  video,
  onClose,
}: {
  video: VideoWithCategory;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── iframe Player ── */}
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* ── Modal Footer ── */}
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#D4AF37]">
                {video.categoryTag}
              </span>
              <h3 className="text-white font-semibold text-base mt-1 line-clamp-2 leading-snug">
                {video.title}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-neutral-500 text-xs">
                {video.viewCount && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {video.viewCount}
                  </span>
                )}
                {video.likeCount && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    {video.likeCount}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* FIX: Modal YouTube button — ghost outline, solid red only on hover */}
              <Link
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/yt flex items-center gap-2 bg-transparent hover:bg-[#FF0000] border border-[#FF0000]/60 hover:border-[#FF0000] text-[#FF0000] hover:text-white text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-full transition-all duration-200"
              >
                <svg
                  width="16" height="11"
                  viewBox="0 0 256 180" fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0"
                >
                  <rect width="256" height="180" rx="40" fill="currentColor" />
                  <path
                    d="m102.421 128.06 66.328-38.418-66.328-38.418z"
                    className="fill-white group-hover/yt:fill-[#FF0000]"
                  />
                </svg>
                YouTube
              </Link>

              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-white transition-all duration-200"
                aria-label="Close video"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContentHub({ videos }: ContentHubProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeVideo, setActiveVideo] = useState<VideoWithCategory | null>(null);

  const filtered =
    activeFilter === 'All'
      ? videos
      : videos.filter((v) => v.categoryTag === activeFilter);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  function handleFilterChange(filter: string) {
    setActiveFilter(filter);
    setVisibleCount(PAGE_SIZE);
  }

  function openVideo(video: VideoWithCategory) {
    setActiveVideo(video);
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    setActiveVideo(null);
    document.body.style.overflow = '';
  }

  return (
    <>
      {/* ── Video Modal (renders above everything) ── */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={closeVideo} />
      )}

      <section
        id="content-hub"
        className="relative py-24 px-6 bg-[#0A0A0A] border-t border-white/10 text-white font-sans antialiased"
      >

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] mb-3 font-semibold">
                Content Library
              </p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                THE LATEST
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11]">
                  FROM BG.
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 backdrop-blur-md px-5 py-3 rounded-full self-start sm:self-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400">
                {filtered.length} Videos
              </span>
            </div>
          </div>

          {/* ── Filter Chips ── */}
          <div className="flex flex-wrap gap-3 mb-14">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-7 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                  activeFilter === filter
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                    : 'border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* ── Empty State ── */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-600">
              <svg className="w-16 h-16 mb-6 opacity-30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <path d="M10 8l6 4-6 4V8z" />
              </svg>
              <p className="text-sm tracking-widest uppercase">No videos in this category yet</p>
            </div>
          )}

          {/* ── Video Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visible.map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.4, delay: index < PAGE_SIZE ? index * 0.05 : 0 }}
                  whileHover={{ y: -8 }}
                  className="group bg-neutral-950 border border-neutral-900 hover:border-[#D4AF37]/30 rounded-2xl overflow-hidden transition-colors duration-300"
                >
                  {/* ── Thumbnail ── */}
                  <button
                    onClick={() => openVideo(video)}
                    className="block w-full text-left cursor-pointer"
                    aria-label={`Play ${video.title}`}
                  >
                    <div className="aspect-video bg-neutral-900 relative overflow-hidden">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                          <svg className="w-12 h-12 text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21.582 6.186a2.506 2.506 0 0 0-1.765-1.769C18.265 4 12 4 12 4s-6.265 0-7.817.417A2.506 2.506 0 0 0 2.418 6.186 26.142 26.142 0 0 0 2 12a26.142 26.142 0 0 0 .418 5.814 2.506 2.506 0 0 0 1.765 1.769C5.735 20 12 20 12 20s6.265 0 7.817-.417a2.506 2.506 0 0 0 1.765-1.769A26.142 26.142 0 0 0 22 12a26.142 26.142 0 0 0-.418-5.814z"/>
                            <polygon fill="#0A0A0A" points="9.954,15.196 15.581,12 9.954,8.804"/>
                          </svg>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/40 hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <span className="text-[9px] font-bold tracking-widest uppercase text-white/80">Watch Here</span>
                        </div>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/80 backdrop-blur-sm border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                          {video.categoryTag}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* ── Video Info ── */}
                  <div className="p-5">
                    <h3 className="text-sm md:text-base font-semibold leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                      {video.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-3 text-neutral-600 text-xs">
                      {video.viewCount && (
                        <span className="flex items-center gap-1.5 text-neutral-500">
                          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {video.viewCount}
                        </span>
                      )}
                      {video.likeCount && (
                        <span className="flex items-center gap-1.5 text-neutral-500">
                          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                          </svg>
                          {video.likeCount}
                        </span>
                      )}
                      <span className="ml-auto text-neutral-700 font-mono text-[10px]">
                        {new Date(video.publishedAt).toLocaleDateString('en-PH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* ── Dual Action Buttons ── */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-900">

                      {/* Watch Here — gold */}
                      <button
                        onClick={() => openVideo(video)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#e8c84a] text-black text-[10px] font-black tracking-widest uppercase py-2.5 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Here
                      </button>

                      {/*
                        FIX: YouTube button
                        - Default state: dark bg, red YT logo visible
                        - Hover state: red bg, WHITE logo (was invisible before because logo was also red on red)
                        - Solution: use `color` (currentColor) for the icon rect, white play arrow always
                      */}
                      <Link
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          group/yt
                          flex-1 flex items-center justify-center gap-2
                          bg-neutral-900 hover:bg-[#FF0000]
                          border border-neutral-800 hover:border-[#FF0000]
                          text-[#FF0000] hover:text-white
                          text-[10px] font-black tracking-widest uppercase
                          py-2.5 rounded-lg
                          transition-all duration-200
                        "
                      >
                        {/*
                          Icon strategy:
                          - The rounded-rect background uses `currentColor`
                            → red (#FF0000) on default, white on hover (text-white)
                          - The play triangle is always the opposite: white on default, red on hover
                            so it stays visible in both states
                        */}
                        <svg
                          width="16"
                          height="11"
                          viewBox="0 0 256 180"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0"
                        >
                          {/* Rounded rect — currentColor so it flips with text color */}
                          <rect
                            width="256"
                            height="180"
                            rx="40"
                            fill="currentColor"
                          />
                          {/*
                            Play triangle:
                            default = white (contrast against red rect)
                            hover   = #FF0000 (contrast against white rect on red bg)
                            Using group-hover trick with Tailwind
                          */}
                          <path
                            d="m102.421 128.06 66.328-38.418-66.328-38.418z"
                            className="fill-white group-hover/yt:fill-[#FF0000]"
                          />
                        </svg>
                        YouTube
                      </Link>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Load More ── */}
          {remaining > 0 && (
            <div className="flex justify-center mt-16">
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-14 py-5 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37] text-white hover:text-black font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300"
              >
                Load More — {remaining} remaining
              </motion.button>
            </div>
          )}

          {/* ── All loaded ── */}
          {visibleCount >= filtered.length && filtered.length > PAGE_SIZE && (
            <div className="flex justify-center mt-16">
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-700 font-semibold">
                ✦ All {filtered.length} videos loaded ✦
              </p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}