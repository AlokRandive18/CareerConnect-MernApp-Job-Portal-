import React from 'react';

export const CareerConnectLogo = ({ size = 'md', isDark = false }) => {
  const sizeMap = {
    sm: { width: 28, height: 28, fontSize: '10px' },
    md: { width: 40, height: 40, fontSize: '13px' },
    lg: { width: 56, height: 56, fontSize: '18px' }
  };

  const { width, height, fontSize } = sizeMap[size] || sizeMap.md;
  const bgColor = isDark ? '#1F2937' : '#FFFFFF';
  const gradientStart = '#3B82F6';
  const gradientEnd = '#8B5CF6';
  const textColor = isDark ? '#F3F4F6' : '#111827';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform hover:scale-110"
    >
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientStart} />
          <stop offset="100%" stopColor={gradientEnd} />
        </linearGradient>
      </defs>

      {/* Background Circle */}
      <circle cx="24" cy="24" r="22" fill={bgColor} stroke="url(#logoGradient)" strokeWidth="2" />

      {/* Icon: Stylized Career Path */}
      {/* Bottom line (foundation) */}
      <line x1="8" y1="36" x2="40" y2="36" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Rising path (upward trajectory) */}
      <polyline
        points="12,32 18,26 24,28 30,18 36,20"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stars/Achievements along the path */}
      {/* Star 1 */}
      <circle cx="12" cy="32" r="2.5" fill={gradientStart} />
      {/* Star 2 */}
      <circle cx="24" cy="28" r="2.5" fill={gradientEnd} />
      {/* Star 3 */}
      <circle cx="36" cy="20" r="2.5" fill={gradientStart} />

      {/* Top achievement star */}
      <g transform="translate(30, 12)">
        <polygon
          points="0,-4 1.2,-1.2 4,-0.4 1.6,1.6 2.4,4.4 0,2.4 -2.4,4.4 -1.6,1.6 -4,-0.4 -1.2,-1.2"
          fill={gradientEnd}
        />
      </g>
    </svg>
  );
};

export default CareerConnectLogo;
