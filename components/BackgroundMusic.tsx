'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';

export interface BackgroundMusicRef {
  togglePlay: () => void;
  isPlaying: boolean;
}

interface BackgroundMusicProps {
  src?: string;
  fallbackSrc?: string;
  loop?: boolean;
  volume?: number;
  onError?: (e: Event) => void;
}

const BackgroundMusic = forwardRef<BackgroundMusicRef, BackgroundMusicProps>(
  (
    {
      src = 'music/background-music.mp3',
      fallbackSrc = 'music/background-music.ogg',
      loop = true,
      volume = 0.7,
      onError,
    },
    ref
  ) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // ── Sync volume prop changes ──────────────────────────────────────────────
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = Math.min(1, Math.max(0, volume));
    }, [volume]);

    // ── Sync loop prop changes ────────────────────────────────────────────────
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.loop = loop;
    }, [loop]);

    // ── Audio event listeners ─────────────────────────────────────────────────
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handlePlay  = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      const handleError = (e: Event) => {
        setIsPlaying(false);
        if (onError) onError(e);
        else console.warn('[BackgroundMusic] Audio error:', e);
      };

      audio.addEventListener('play',  handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // FIX: preload="metadata" — safer on iOS/Android vs "auto"
      audio.preload = 'metadata';
      audio.volume  = Math.min(1, Math.max(0, volume));
      audio.loop    = loop;

      return () => {
        audio.removeEventListener('play',  handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── togglePlay is stable via useCallback ──────────────────────────────────
    const togglePlay = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio.play().catch((err) => {
          console.warn('[BackgroundMusic] Play failed:', err);
        });
      } else {
        audio.pause();
      }
    }, []);

    // FIX: isPlaying included in deps so parent always gets the latest value
    useImperativeHandle(
      ref,
      () => ({ togglePlay, isPlaying }),
      [togglePlay, isPlaying]
    );

    return (
      <audio
        ref={audioRef}
        playsInline
        style={{ display: 'none' }}
      >
        <source src={src} type="audio/mpeg" />
        <source src={fallbackSrc} type="audio/ogg" />
      </audio>
    );
  }
);

// FIX: display name para sa React DevTools
BackgroundMusic.displayName = 'BackgroundMusic';

export default BackgroundMusic;