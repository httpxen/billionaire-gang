'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: 'blur(10px)',
            transition: {
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
        >
          {/* Premium textured background - no image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(45deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:100%_100%,18px_18px,22px_22px]" />

          {/* Dark vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_48%,rgba(0,0,0,0.95)_100%)]" />

          {/* Moving gold glow */}
          <motion.div
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 0.5, 0] }}
            transition={{
              duration: 2.4,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
            className="absolute top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent blur-2xl"
          />

          <div className="relative flex flex-col items-center justify-center">
            {/* Crown */}
            <motion.svg
              initial={{ opacity: 0, y: 40, rotate: -8, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, rotate: -5, scale: 1 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15,
              }}
              width="150"
              height="92"
              viewBox="0 0 220 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -top-20 right-2 drop-shadow-[0_0_25px_rgba(212,175,55,0.55)]"
            >
              <motion.path
                d="M35 95L25 32L73 72L110 22L147 72L195 32L185 95H35Z"
                stroke="url(#goldGradient)"
                strokeWidth="7"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.25, ease: 'easeInOut' }}
              />
              <motion.path
                d="M41 96C72 108 148 108 179 96"
                stroke="url(#goldGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.55, ease: 'easeInOut' }}
              />
              <circle cx="25" cy="32" r="7" fill="#F7D774" />
              <circle cx="110" cy="22" r="8" fill="#F7D774" />
              <circle cx="195" cy="32" r="7" fill="#F7D774" />
              <circle cx="73" cy="72" r="5" fill="#FFF1A8" />
              <circle cx="147" cy="72" r="5" fill="#FFF1A8" />

              <defs>
                <linearGradient id="goldGradient" x1="25" y1="22" x2="195" y2="105">
                  <stop stopColor="#FFF3B0" />
                  <stop offset="0.45" stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#8A6A12" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Main BG logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, y: 30 }}
              animate={{
                opacity: 1,
                scale: [0.45, 1.08, 1],
                y: 0,
              }}
              transition={{
                duration: 1.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <motion.h1
                animate={{
                  textShadow: [
                    '0 0 20px rgba(212,175,55,0.25)',
                    '0 0 70px rgba(212,175,55,0.75)',
                    '0 0 20px rgba(212,175,55,0.25)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="select-none text-[120px] font-black leading-none tracking-[-0.12em] text-transparent sm:text-[170px] md:text-[215px]"
                style={{
                  WebkitTextStroke: '3px #F8E7A1',
                  backgroundImage:
                    'linear-gradient(180deg, #FFFFFF 0%, #F7D774 35%, #D4AF37 60%, #7A5A0C 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                BG
              </motion.h1>

              {/* Shine across BG text */}
              <motion.div
                initial={{ x: '-130%' }}
                animate={{ x: '130%' }}
                transition={{
                  duration: 1.6,
                  delay: 0.65,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 1.25,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm"
                style={{
                  clipPath: 'polygon(0 0, 38% 0, 64% 100%, 24% 100%)',
                }}
              />
            </motion.div>

            {/* Billionaire Gang */}
            <motion.div
              initial={{ opacity: 0, y: 18, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.38em' }}
              transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
              className="mt-[-8px] text-center text-sm font-bold uppercase text-[#F7D774] sm:text-lg md:text-2xl"
            >
              Billionaire Gang
            </motion.div>

            {/* Script Gang */}
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.15, ease: 'easeOut' }}
              className="mt-3 font-serif text-3xl italic tracking-wide text-white sm:text-4xl md:text-5xl"
            >
              What's Up, BG!!!🔥
            </motion.div>

            {/* Loading bar */}
            <div className="relative mt-12 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
              />
            </div>

            {/* Small premium text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.2,
              }}
              className="mt-5 text-[10px] uppercase tracking-[0.45em] text-white/45 sm:text-xs"
            >
              What's Money Papers Only
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}