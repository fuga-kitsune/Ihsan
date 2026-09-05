import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface StreamlineMoonIconProps {
  size?: number;
  focused?: boolean;
}

export const StreamlineMoonIcon: React.FC<StreamlineMoonIconProps> = ({
  size = 24,
  focused = true,
}) => {
  const moonColor = focused ? '#FFE500' : '#D1D5DB';
  const moonShadow = focused ? '#EBCB00' : '#9CA3AF';
  const strokeColor = focused ? '#45413C' : '#9CA3AF';
  const shadowOpacity = focused ? 0.15 : 0.08;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Ground Shadow */}
      <Path
        d="M11.170 45.500 A14.5 1.5 0 1 0 40.170 45.500 A14.5 1.5 0 1 0 11.170 45.500 Z"
        fill="#45413c"
        opacity={shadowOpacity}
      />
      {/* Moon Base */}
      <Path
        d="M28.3,4.65A15.42,15.42,0,1,1,6.64,26.32a.62.62,0,0,0-1.1.52A18.84,18.84,0,1,0,28.83,3.55.62.62,0,0,0,28.3,4.65Z"
        fill={moonColor}
      />
      {/* Moon Crescent Inner Shadow */}
      <Path
        d="M41.05,14.43a19.23,19.23,0,0,1,0,5.36A18.84,18.84,0,0,1,5.85,26.14a.58.58,0,0,0-.31.7A18.84,18.84,0,1,0,41.05,14.43Z"
        fill={moonShadow}
      />
      {/* Moon Outline */}
      <Path
        d="M28.3,4.65A15.42,15.42,0,1,1,6.64,26.32a.62.62,0,0,0-1.1.52A18.84,18.84,0,1,0,28.83,3.55.62.62,0,0,0,28.3,4.65Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
    </Svg>
  );
};
