import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface StreamlineCheckBadgeProps {
  size?: number;
}

export const StreamlineCheckBadge: React.FC<StreamlineCheckBadgeProps> = ({ size = 32 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Soft shadow base matching Freemojis style */}
      <Path
        d="M12.500 45.500 A11.5 1.5 0 1 0 35.500 45.500 A11.5 1.5 0 1 0 12.500 45.500 Z"
        fill="#45413c"
        opacity={0.15}
      />
      {/* Emerald Badge Circle Base */}
      <Circle
        cx="24"
        cy="24"
        r="18"
        fill="#10B981"
        stroke="#45413c"
        strokeWidth="2.5"
      />
      {/* Streamline Tick / Checkmark */}
      <Path
        d="M17 24.5L22 29.5L31.5 18"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
