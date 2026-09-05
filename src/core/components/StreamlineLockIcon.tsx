import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

interface StreamlineLockIconProps {
  size?: number;
}

export const StreamlineLockIcon: React.FC<StreamlineLockIconProps> = ({ size = 32 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Base drop shadow */}
      <Path
        d="M14 45.5 A10 1.5 0 1 0 34 45.5 A10 1.5 0 1 0 14 45.5 Z"
        fill="#45413c"
        opacity={0.15}
      />
      {/* Shackle */}
      <Path
        d="M17 21V15C17 11.134 20.134 8 24 8C27.866 8 31 11.134 31 15V21"
        stroke="#45413c"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Lock Body - Rich Golden Amber / Emerald Green Gradient */}
      <Rect
        x="12"
        y="20"
        width="24"
        height="20"
        rx="6"
        fill="#10B981"
        stroke="#45413c"
        strokeWidth="3.5"
      />
      {/* Keyhole */}
      <Circle cx="24" cy="28" r="2.5" fill="#FFFFFF" />
      <Path
        d="M24 29.5V34"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};
