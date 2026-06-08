'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 400px down
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, y: 30, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.7 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={scrollToTop}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-[9000] group"
          style={{ outline: 'none' }}
        >
          {/* Outer glow ring */}
          <motion.span
            animate={
              isHovered
                ? { opacity: 1, scale: 1.35 }
                : { opacity: 0, scale: 1 }
            }
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-[#D4AF37]/25 blur-md pointer-events-none"
          />

          {/* Pulse ring on idle */}
          <motion.span
            animate={{ scale: [1, 1.55, 1], opacity: [0.45, 0, 0.45] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full border border-[#D4AF37]/40 pointer-events-none"
          />

          {/* Main button body */}
          <div
            className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: '#0a0a0a',
              boxShadow:
                '0 0 0 1px rgba(212,175,55,0.55), 0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(212,175,55,0.12)',
            }}
          >
            {/* Gold shimmer sweep on hover */}
            <motion.div
              initial={{ x: '-120%' }}
              animate={isHovered ? { x: '120%' } : { x: '-120%' }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F7D774]/30 to-transparent blur-sm"
              style={{ clipPath: 'polygon(0 0, 38% 0, 64% 100%, 24% 100%)' }}
            />

            {/* BG logo background text */}
            <motion.span
              animate={isHovered ? { opacity: 0.08 } : { opacity: 0.04 }}
              transition={{ duration: 0.3 }}
              className="absolute text-[28px] font-black tracking-[-0.12em] select-none pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, #FFFFFF 0%, #F7D774 35%, #D4AF37 60%, #7A5A0C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              BG
            </motion.span>

            {/* Arrow icon */}
            <motion.svg
              animate={isHovered ? { y: -3 } : { y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              {/* Shaft */}
              <motion.line
                x1="12"
                y1="19"
                x2="12"
                y2="6"
                stroke="url(#arrowGold)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              />
              {/* Arrowhead left */}
              <motion.line
                x1="5.5"
                y1="12.5"
                x2="12"
                y2="6"
                stroke="url(#arrowGold)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.15 }}
              />
              {/* Arrowhead right */}
              <motion.line
                x1="18.5"
                y1="12.5"
                x2="12"
                y2="6"
                stroke="url(#arrowGold)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.15 }}
              />
              <defs>
                <linearGradient id="arrowGold" x1="12" y1="6" x2="12" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFF3B0" />
                  <stop offset="0.5" stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#8A6A12" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          {/* Tooltip label */}
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
            transition={{ duration: 0.25 }}
            className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] bg-black/90 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full pointer-events-none"
          >
            Back to Top
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}