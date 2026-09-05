import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface StreamlineDeedsIconProps {
  size?: number;
  focused?: boolean;
}

export const StreamlineDeedsIcon: React.FC<StreamlineDeedsIconProps> = ({
  size = 24,
  focused = true,
}) => {
  const baseColor = focused ? '#10B981' : '#D1D5DB';
  const strokeColor = focused ? '#45413C' : '#9CA3AF';
  const checkColor = '#FFFFFF';
  const shadowOpacity = focused ? 0.15 : 0.08;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Soft shadow base matching Freemojis style */}
      <Path
        d="M12.500 45.500 A11.5 1.5 0 1 0 35.500 45.500 A11.5 1.5 0 1 0 12.500 45.500 Z"
        fill="#45413c"
        opacity={shadowOpacity}
      />
      {/* Emerald Badge Circle Base */}
      <Circle
        cx="24"
        cy="24"
        r="18"
        fill={baseColor}
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      {/* Streamline Tick / Checkmark */}
      <Path
        d="M17 24.5L22 29.5L31.5 18"
        stroke={checkColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
