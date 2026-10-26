import React from 'react';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  inverted?: boolean;
}

export function BrandLogo({
  size = 40,
  showWordmark = true,
  className = '',
  inverted = false,
}: BrandLogoProps) {
  const bubColor = inverted ? '#ffffff' : '#1F7A5E';
  const keyColor = inverted ? '#1F7A5E' : '#ffffff';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Mihrab Arch / Speech Bubble Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <path
          d="M10 52V27C10 17 20 11 32 2C44 11 54 17 54 27V52H38L32 60L26 52Z"
          fill={bubColor}
          stroke={bubColor}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <g fill={keyColor}>
          {/* 8-pointed star */}
          <rect x="27.5" y="15.5" width="9" height="9" />
          <rect
            x="27.5"
            y="15.5"
            width="9" height="9"
            transform="rotate(45 32 20)"
          />
          {/* Open Book pages */}
          <path d="M31 47C27 44 21 43.5 16 45V32C21 30.5 27 31.5 31 34.5Z" />
          <path d="M33 47C37 44 43 43.5 48 45V32C43 30.5 37 31.5 33 34.5Z" />
        </g>
      </svg>

      {showWordmark && (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-[#16231E]">
            ilm<span className="opacity-60 text-[#1F7A5E]">.me</span>
          </span>
          <span className="text-xl font-bold text-[#55655F]" dir="rtl">
            علم
          </span>
        </div>
      )}
    </div>
  );
}
