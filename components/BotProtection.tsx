"use client";

import { useEffect, useState, useRef } from 'react';

interface BotProtectionProps {
  onVerified: (isHuman: boolean, score: number) => void;
  children: React.ReactNode;
}

export function BotProtection({ onVerified, children }: BotProtectionProps) {
  const [verified, setVerified] = useState(false);
  const mouseMovements = useRef(0);
  const startTime = useRef(Date.now());
  const hasInteracted = useRef(false);

  useEffect(() => {
    const handleMouseMove = () => {
      mouseMovements.current++;
      hasInteracted.current = true;
    };

    const handleTouch = () => {
      hasInteracted.current = true;
    };

    const handleKeyPress = () => {
      hasInteracted.current = true;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('keydown', handleKeyPress);

    const verifyTimeout = setTimeout(() => {
      const timeOnPage = Date.now() - startTime.current;
      const score = calculateBotScore(mouseMovements.current, timeOnPage, hasInteracted.current);
      const isHuman = score < 50;
      
      setVerified(true);
      onVerified(isHuman, score);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(verifyTimeout);
    };
  }, [onVerified]);

  return <>{children}</>;
}

function calculateBotScore(movements: number, timeOnPage: number, interacted: boolean): number {
  let score = 0;
  
  if (movements < 5) score += 20;
  if (timeOnPage < 1500) score += 25;
  if (!interacted) score += 30;
  
  if (typeof window !== 'undefined') {
    if (!window.navigator.cookieEnabled) score += 15;
    if (!window.screen || window.screen.width === 0) score += 15;
    if (!window.navigator.language) score += 10;
  }
  
  return Math.min(score, 100);
}

export function HoneypotField() {
  return (
    <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
      />
      <input
        type="email"
        name="email_confirm"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
