'use client';

import { motion, Variants } from 'framer-motion'; // ← DAGDAG: Variants type
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect, useCallback } from 'react';

type YouTubeVideo = {
  id: string;
  title: string;
  viewCount?: string;
  likeCount?: string;
};

type ChannelStats = {
  subscriberCount: string;
  totalViews: string;
  videoCount: string;
};

interface HeroProps {
  latestVideo: YouTubeVideo | null;
  channelStats: ChannelStats | null;
}

// ─── Tracks Config ─────────────────────────────────────────────────────────────
const TRACKS = [
  { title: 'Billionaire Gang - Asiong De Luna (Prod By. Coco Beats)', src: 'music/background-music1.mp3' },
  { title: 'Billionaire Gang Acoustic Version LYRICS Zarckaroo Gaming Musikero ng Billionaire Gang', src: 'music/background-music2.mp3' },
];

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

// ─── Spotify Mini Player ───────────────────────────────────────────────────────
interface SpotifyMiniPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTrack: string;
  progress: number;
  currentTime: string;
  totalTime: string;
  volume: number;
  onVolumeChange: (v: number) => void;
  onSeek: (pct: number) => void;
}

function SpotifyMiniPlayer({
  isPlaying,
  onPlayPause,
  onStop,
  onNext,
  onPrev,
  currentTrack,
  progress,
  currentTime,
  totalTime,
  volume,
  onVolumeChange,
  onSeek,
}: SpotifyMiniPlayerProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const isDraggingProgress = useRef(false);

  const getProgressPct = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar) return null;
    const rect = bar.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingProgress.current = true;
    const pct = getProgressPct(e);
    if (pct !== null) onSeek(pct);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingProgress.current) return;
      const pct = getProgressPct(e);
      if (pct !== null) onSeek(pct);
    };
    const onMouseUp = () => { isDraggingProgress.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onSeek]);

  const isDraggingVol = useRef(false);

  const getVolPct = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    const bar = volumeRef.current;
    if (!bar) return null;
    const rect = bar.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  };

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingVol.current = true;
    const vol = getVolPct(e);
    if (vol !== null) onVolumeChange(vol);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingVol.current) return;
      const vol = getVolPct(e);
      if (vol !== null) onVolumeChange(vol);
    };
    const onMouseUp = () => { isDraggingVol.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onVolumeChange]);

  const volumePct = Math.round(volume * 100);

  return (
    <div
      style={{
        background: '#121212',
        borderRadius: '16px',
        padding: '24px',
        width: 'clamp(320px, 24vw, 400px)',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.15)',
        userSelect: 'none',
      }}
    >
      {/* Album Art */}
      <div style={{ position: 'relative', marginBottom: '18px' }}>
        <div style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '10px',
          background: '#0a0a0a',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}>
          <Image
            src="/images/BG.jpg"
            alt="Billionaire Gang"
            width={352}
            height={352}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            priority
          />
          {isPlaying && (
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '10px',
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
              animation: 'bgPulse 2s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          )}
        </div>
      </div>

      {/* Track Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ overflow: 'hidden', maxWidth: '240px' }}>
          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <div
              key={currentTrack}
              style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                animation: currentTrack.length > 20 ? 'marqueeLoop 14s linear infinite' : 'none',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 700, paddingRight: '48px', flexShrink: 0 }}>
                {currentTrack}
              </span>
              {currentTrack.length > 20 && (
                <span style={{ fontSize: '15px', fontWeight: 700, paddingRight: '48px', flexShrink: 0 }}>
                  {currentTrack}
                </span>
              )}
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#b3b3b3' }}>Billionaire Gang</p>
        </div>
        <button
          onClick={() => setIsLiked(v => !v)}
          aria-label="Like"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: isLiked ? '#1db954' : '#b3b3b3', fontSize: '20px',
            lineHeight: 1, padding: '4px',
          }}
        >
          {isLiked ? '♥' : '♡'}
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div
          ref={progressRef}
          onMouseDown={handleProgressMouseDown}
          style={{
            width: '100%', height: '4px', background: '#535353',
            borderRadius: '2px', cursor: 'pointer', marginBottom: '6px',
            position: 'relative',
          }}
          onMouseEnter={e => {
            const dot = (e.currentTarget.querySelector('.sp-dot') as HTMLElement);
            if (dot) dot.style.opacity = '1';
          }}
          onMouseLeave={e => {
            const dot = (e.currentTarget.querySelector('.sp-dot') as HTMLElement);
            if (dot && !isDraggingProgress.current) dot.style.opacity = '0';
          }}
        >
          <div style={{
            height: '100%', background: '#1db954', borderRadius: '2px',
            width: `${progress}%`, position: 'relative',
            transition: isDraggingProgress.current ? 'none' : 'width 0.5s linear',
          }}>
            <div
              className="sp-dot"
              style={{
                width: '12px', height: '12px', background: '#fff',
                borderRadius: '50%', position: 'absolute', right: '-6px',
                top: '50%', transform: 'translateY(-50%)',
                opacity: 0, transition: 'opacity 0.15s',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#b3b3b3' }}>
          <span>{currentTime}</span>
          <span>{totalTime}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => setIsShuffle(v => !v)}
          aria-label="Shuffle"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: isShuffle ? '#1db954' : '#b3b3b3', fontSize: '18px',
            padding: '6px', borderRadius: '50%',
          }}
        >
          ⇌
        </button>
        <button onClick={onPrev} aria-label="Previous"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b3b3b3', fontSize: '22px', padding: '6px', borderRadius: '50%' }}>
          ⏮
        </button>
        <button
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            width: '54px', height: '54px', borderRadius: '50%',
            background: '#fff', color: '#000', border: 'none',
            cursor: 'pointer', fontSize: '20px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)', flexShrink: 0,
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={onNext} aria-label="Next"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b3b3b3', fontSize: '22px', padding: '6px', borderRadius: '50%' }}>
          ⏭
        </button>
        <button onClick={onStop} aria-label="Stop"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b3b3b3', fontSize: '18px', padding: '6px', borderRadius: '50%' }}>
          ⏹
        </button>
      </div>

      {/* Volume */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{ color: '#b3b3b3', fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}
          title={volume === 0 ? 'Unmute' : 'Mute'}
        >
          {volume === 0 ? '🔇' : volume < 0.4 ? '🔉' : '🔊'}
        </span>
        <div
          ref={volumeRef}
          onMouseDown={handleVolumeMouseDown}
          style={{
            flex: 1, height: '4px', background: '#535353',
            borderRadius: '2px', cursor: 'pointer', position: 'relative',
          }}
          onMouseEnter={e => {
            const dot = (e.currentTarget.querySelector('.vol-dot') as HTMLElement);
            if (dot) dot.style.opacity = '1';
          }}
          onMouseLeave={e => {
            const dot = (e.currentTarget.querySelector('.vol-dot') as HTMLElement);
            if (dot && !isDraggingVol.current) dot.style.opacity = '0';
          }}
        >
          <div style={{
            height: '100%', background: '#1db954', borderRadius: '2px',
            width: `${volumePct}%`, position: 'relative',
          }}>
            <div
              className="vol-dot"
              style={{
                width: '10px', height: '10px', background: '#fff',
                borderRadius: '50%', position: 'absolute', right: '-5px',
                top: '50%', transform: 'translateY(-50%)',
                opacity: 0, transition: 'opacity 0.15s',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
        <span style={{ color: '#b3b3b3', fontSize: '11px', minWidth: '32px', textAlign: 'right' }}>
          {volumePct}%
        </span>
      </div>
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero({ latestVideo, channelStats }: HeroProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[0].src;
    audio.preload = 'metadata';
    audio.volume = 0.7;
    audio.load();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime  = () => setCurrentTime(audio.currentTime);

    const onMeta = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      const next = (currentIndex + 1) % TRACKS.length;
      loadTrack(next, true);
    };

    audio.addEventListener('play',           onPlay);
    audio.addEventListener('pause',          onPause);
    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('canplay',        onMeta);
    audio.addEventListener('ended',          onEnded);
    audio.volume = volume;

    return () => {
      audio.removeEventListener('play',           onPlay);
      audio.removeEventListener('pause',          onPause);
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('canplay',        onMeta);
      audio.removeEventListener('ended',          onEnded);
    };
  }, [currentIndex, volume]);

  const loadTrack = useCallback((index: number, autoplay = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentIndex(index);
    setCurrentTime(0);
    setDuration(0);
    audio.src = TRACKS[index].src;
    audio.preload = 'metadata';
    audio.load();
    if (autoplay) audio.play().catch(console.error);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(console.error);
    else audio.pause();
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const next = () => loadTrack((currentIndex + 1) % TRACKS.length, isPlaying);
  const prev = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return; }
    loadTrack((currentIndex - 1 + TRACKS.length) % TRACKS.length, isPlaying);
  };

  const handleSeek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    audio.currentTime = pct * audio.duration;
  }, []);

  const handleVolume = useCallback((vol: number) => {
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── FIX: Properly typed Variants ──────────────────────────────────────────
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 60, damping: 20 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A] text-white font-sans antialiased selection:bg-[#D4AF37] selection:text-black">

      <audio ref={audioRef} playsInline preload="metadata" style={{ display: 'none' }}>
        <source src={TRACKS[0].src} type="audio/mpeg" />
      </audio>

      <style>{`
        @keyframes bgPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes marqueeLoop {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Ambient Luxury Lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 flex justify-between px-12 md:px-24 pointer-events-none opacity-20">
        <div className="w-[1px] h-full bg-neutral-800" />
        <div className="w-[1px] h-full bg-neutral-800 hidden md:block" />
        <div className="w-[1px] h-full bg-neutral-800 hidden md:block" />
        <div className="w-[1px] h-full bg-neutral-800" />
      </div>

      {/* Cinematic Background */}
      <div
        className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity filter contrast-125 brightness-75"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 65%, rgba(0,0,0,0))',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 65%, rgba(0,0,0,0))',
        }}
      />

      {/* ── SPOTIFY PLAYER — Right Side ── */}
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        className="absolute right-4 xl:right-10 top-[45%] -translate-y-1/2 z-20 hidden lg:block"
      >
        <div style={{
          position: 'absolute', inset: '-20px',
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)',
          borderRadius: '24px', pointerEvents: 'none', zIndex: -1,
        }} />

        <SpotifyMiniPlayer
          isPlaying={isPlaying}
          onPlayPause={togglePlay}
          onStop={stop}
          onNext={next}
          onPrev={prev}
          currentTrack={TRACKS[currentIndex].title}
          progress={progress}
          currentTime={fmt(currentTime)}
          totalTime={fmt(duration)}
          volume={volume}
          onVolumeChange={handleVolume}
          onSeek={handleSeek}
        />
      </motion.div>

      {/* ── Main Content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start text-left"
      >
        {/* Live Status */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 backdrop-blur-md px-5 py-2.5 rounded-full mb-6 shadow-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
          </span>
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400">
            OFFICIAL Website
          </span>
        </motion.div>

        {/* Founder Badge */}
        <motion.div variants={itemVariants} className="mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg">
            <img src="/images/von-ordona.jpg" alt="Von Ordona" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[#D4AF37] text-sm font-bold tracking-widest">FOUNDER</p>
            <p className="text-white font-semibold text-lg">Von Ordona</p>
          </div>
        </motion.div>

        {/* Main Title */}
        <div className="relative">
          <motion.h1
            variants={itemVariants}
            className="text-[13vw] sm:text-[90px] md:text-[130px] lg:text-[150px] font-black tracking-tighter leading-[0.85] uppercase text-white"
          >
            BILLIONAIRE
          </motion.h1>
          <motion.h1
            variants={itemVariants}
            className="text-[13vw] sm:text-[90px] md:text-[130px] lg:text-[150px] font-black tracking-tighter leading-[0.85] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11]"
          >
            GANG<span className="text-white">.</span>
          </motion.h1>
        </div>

        {/* Latest Content Teaser */}
        <motion.div variants={itemVariants} className="mt-4 inline-flex items-center">
          <div className="flex items-center gap-2 bg-[#D4AF37] text-black text-[10px] font-bold tracking-widest uppercase px-4 h-11 rounded-l-full flex-shrink-0">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 256 180" fill="none" className="drop-shadow-sm">
                <path fill="#FF0000" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"/>
                <path fill="#FFFFFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z"/>
              </svg>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black/80"></span>
            </span>
            Latest Drop
          </div>

          <div className="flex items-center gap-3 bg-[#111] border border-[#D4AF37] border-l-0 px-5 h-11 rounded-r-full group cursor-pointer">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-medium whitespace-nowrap">Now</span>
            <div className="w-px h-4 bg-neutral-700 flex-shrink-0" />

            {latestVideo ? (
              <Link href={`https://www.youtube.com/watch?v=${latestVideo.id}`} target="_blank"
                className="font-['Bebas_Neue'] text-[17px] tracking-wider text-white group-hover:text-[#D4AF37] transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {latestVideo.title.toUpperCase()}
              </Link>
            ) : (
              <span className="font-['Bebas_Neue'] text-[17px] tracking-wider text-white">LOADING LATEST UPLOAD...</span>
            )}

            {latestVideo?.viewCount && (
              <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-neutral-700 rounded-full px-2.5 py-0.5 flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span className="text-[11px] font-semibold text-[#D4AF37] tracking-wide">{latestVideo.viewCount}</span>
              </div>
            )}

            {latestVideo?.likeCount && (
              <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-neutral-700 rounded-full px-2.5 py-0.5 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span className="text-[11px] font-semibold text-[#D4AF37] tracking-wide">{latestVideo.likeCount}</span>
              </div>
            )}

            <svg className="w-3 h-3 text-neutral-600 group-hover:text-[#D4AF37] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p variants={itemVariants} className="mt-8 max-w-xl text-neutral-400 text-base sm:text-lg lg:text-xl font-light leading-relaxed tracking-wide">
          The absolute powerhouse of top-tier digital creators, trendsetters, and disruptors.
          Merging high-end luxury lifestyle with unhinged entertainment, high-stakes bets, and the wildest content on the internet.
        </motion.p>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <motion.button
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-6 bg-white text-black font-bold uppercase tracking-[0.15em] text-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-2xl"
            onClick={() => window.open('https://www.youtube.com/@officialbillionairegang', '_blank')}
          >
            JOIN THE GANG
          </motion.button>

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-6 border border-neutral-700 hover:border-[#D4AF37] text-white font-bold uppercase tracking-[0.15em] text-sm backdrop-blur-sm transition-all duration-300"
            onClick={() => document.getElementById('content-hub')?.scrollIntoView({ behavior: 'smooth' })}
          >
            WATCH ALL VIDEOS
          </motion.button>
        </motion.div>

        {/* Gang Stats */}
        <motion.div variants={itemVariants} className="hidden lg:flex items-center gap-16 mt-20 pt-10 border-t border-neutral-900 w-full text-neutral-500">
          <div>
            <p className="text-5xl font-bold text-white">{channelStats?.subscriberCount || '2.89M'}</p>
            <p className="text-xs tracking-widest uppercase mt-1">Total Subscribers</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-white">{channelStats?.videoCount || '447'}</p>
            <p className="text-xs tracking-widest uppercase mt-1">Total Videos</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-white">{channelStats?.totalViews || '568M'}</p>
            <p className="text-xs tracking-widest uppercase mt-1">Total Views</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-[#D4AF37]">🇵🇭</p>
            <p className="text-xs tracking-widest uppercase mt-1">Philippines Based</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none lg:hidden">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs tracking-[3px] text-neutral-500 font-mono"
        >
          SCROLL TO EXPLORE
        </motion.p>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-2xl text-[#D4AF37]"
        >
          ↓
        </motion.div>
      </div>

      {/* Mobile Music Toggle */}
      <div className="absolute bottom-10 right-6 lg:hidden z-20">
        <button
          onClick={togglePlay}
          className="bg-black/90 hover:bg-[#D4AF37] hover:text-black text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] px-5 py-2.5 rounded-full text-sm font-bold tracking-widest flex items-center gap-2 shadow-xl backdrop-blur-md transition-all"
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY MUSIC'}
        </button>
      </div>

    </section>
  );
}