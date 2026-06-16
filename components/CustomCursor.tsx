'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULT_CURSOR = 'images/neon-money.png';
const POINTER_CURSOR = 'images/neon-coin.png';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setIsReady(true);

    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    const LERP = 0.12; // smoothing factor — lower = smoother but slower

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX = lerp(currentX, mouseX, LERP);
      currentY = lerp(currentY, mouseY, LERP);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement;
      setIsHidden(target.tagName === 'IFRAME');
      setIsPointer(!!target.closest('a, button, [role="button"], input, .cursor-pointer'));
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  if (!isReady) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
      style={{
        opacity: isHidden ? 0 : 1,
        transition: 'opacity 0.15s ease',
      }}
    >
      <div
        className={`custom-cursor__inner ${isPointer ? 'is-pointer' : ''} ${isClicking ? 'is-clicking' : ''}`}
      >
        <img
          src={isPointer ? POINTER_CURSOR : DEFAULT_CURSOR}
          alt=""
          draggable={false}
        />
      </div>
    </div>
  );
}