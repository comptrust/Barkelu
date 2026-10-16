import React from 'react';

interface BarkeluLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
  showTagline?: boolean;
  className?: string;
}

export const BarkeluLogo: React.FC<BarkeluLogoProps> = ({
  size = 'md',
  textColor = 'text-zinc-900',
  showTagline = false,
  className = '',
}) => {
  const heights = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className={`flex items-center gap-1.5 ${heights[size]}`}>
        {/* Vector SVG exact reproduction of Barkélü coupon-ticket icon and letterforms */}
        <svg
          viewBox="0 0 540 130"
          className="h-full w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ticketGradComponent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <filter id="ticketBevel" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#064e3b" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Green Perforated Ticket B */}
          <g filter="url(#ticketBevel)">
            <path
              d="
                M 30 16
                C 30 16 38 18 42 22
                C 48 18 56 16 66 16
                C 82 16 94 25 94 42
                C 94 54 86 61 74 65
                C 88 68 96 77 96 94
                C 96 112 82 122 64 122
                C 54 122 46 120 40 116
                C 36 120 30 122 24 122
                C 18 122 14 118 14 112
                C 14 104 22 100 22 92
                C 22 84 14 80 14 69
                C 14 58 22 54 22 46
                C 22 38 14 34 14 26
                C 14 20 18 16 24 16
                C 27 16 30 16 30 16
                Z
                M 46 32
                L 46 54
                C 46 54 62 54 66 54
                C 74 54 78 50 78 43
                C 78 36 74 32 66 32
                Z
                M 46 68
                L 46 102
                C 46 102 64 102 68 102
                C 77 102 81 97 81 85
                C 81 73 77 68 68 68
                Z
              "
              fill="url(#ticketGradComponent)"
              stroke="#14532d"
              strokeWidth="1.2"
              fillRule="evenodd"
            />

            {/* Perforated ticket circular notches on left edge */}
            <circle cx="14" cy="28" r="8" fill="white" />
            <circle cx="14" cy="69" r="8" fill="white" />
            <circle cx="14" cy="110" r="8" fill="white" />

            {/* Vertical dashed perforation slot holes */}
            <g fill="white" opacity="0.95">
              <rect x="42" y="24" width="4.5" height="7.5" rx="2" />
              <rect x="42" y="36.5" width="4.5" height="7.5" rx="2" />
              <rect x="42" y="49" width="4.5" height="7.5" rx="2" />
              <rect x="42" y="61.5" width="4.5" height="7.5" rx="2" />
              <rect x="42" y="74" width="4.5" height="7.5" rx="2" />
              <rect x="42" y="86.5" width="4.5" height="7.5" rx="2" />
              <rect x="42" y="99" width="4.5" height="7.5" rx="2" />
              <rect x="42" y="111.5" width="4.5" height="7.5" rx="2" />
            </g>
          </g>

          {/* arkélü Letterforms */}
          <g className={textColor === 'text-white' ? 'fill-white' : 'fill-zinc-900'}>
            {/* a */}
            <path d="M 124 74 C 124 57 137 47 154 47 C 170 47 178 55 178 69 L 178 116 L 163 116 L 163 105 C 158 113 148 118 138 118 C 123 118 112 108 112 94 C 112 79 125 71 144 71 C 152 71 159 72 163 74 L 163 68 C 163 60 158 56 149 56 C 141 56 135 60 133 66 Z M 163 84 C 159 82 153 81 146 81 C 135 81 128 86 128 93 C 128 100 134 105 143 105 C 153 105 163 98 163 88 Z" />

            {/* r */}
            <path d="M 194 49 L 209 49 L 209 61 C 214 53 223 48 233 48 C 237 48 240 49 243 51 L 238 65 C 234 64 231 63 228 63 C 218 63 210 71 210 84 L 210 116 L 194 116 Z" />

            {/* k */}
            <path d="M 254 18 L 270 18 L 270 72 L 297 49 L 317 49 L 287 75 L 320 116 L 299 116 L 275 85 L 270 90 L 270 116 L 254 116 Z" />

            {/* é with acute accent */}
            <path d="M 347 31 L 360 21 L 369 24 L 356 36 Z M 326 84 C 326 63 340 47 360 47 C 379 47 392 62 392 84 C 392 86 392 89 391 91 L 343 91 C 345 102 353 107 364 107 C 372 107 379 104 384 98 L 392 107 C 385 115 375 119 362 119 C 341 119 326 104 326 84 Z M 376 78 C 375 69 369 59 359 59 C 349 59 344 68 343 78 Z" />

            {/* l */}
            <path d="M 408 18 L 424 18 L 424 116 L 408 116 Z" />

            {/* ü with diaeresis dots */}
            <circle cx="456" cy="31" r="5.5" />
            <circle cx="484" cy="31" r="5.5" />
            <path d="M 438 49 L 454 49 L 454 87 C 454 99 462 105 471 105 C 480 105 487 99 487 87 L 487 49 L 503 49 L 503 86 C 503 107 490 118 471 118 C 452 118 438 107 438 86 Z" />
          </g>
        </svg>
      </div>
      {showTagline && (
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#f68b1e] font-sans mt-0.5">
          Sénégal &bull; Ventes Flash &amp; Bons Plans
        </span>
      )}
    </div>
  );
};
