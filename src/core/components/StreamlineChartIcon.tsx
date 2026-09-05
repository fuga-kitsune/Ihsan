import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface StreamlineChartIconProps {
  size?: number;
  focused?: boolean;
}

export const StreamlineChartIcon: React.FC<StreamlineChartIconProps> = ({
  size = 24,
  focused = true,
}) => {
  const barGreen = focused ? '#6dd627' : '#D1D5DB';
  const barGreenHi = focused ? '#9ceb60' : '#E5E7EB';
  const barOrange = focused ? '#ff6242' : '#9CA3AF';
  const barOrangeHi = focused ? '#ff866e' : '#D1D5DB';
  const barBlue = focused ? '#00b8f0' : '#6B7280';
  const barBlueHi = focused ? '#4acfff' : '#9CA3AF';
  const strokeColor = focused ? '#45413c' : '#9CA3AF';
  const shadowOpacity = focused ? 0.15 : 0.08;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Background Board */}
      <Path
        d="M5.940 5.930 L42.060 5.930 L42.060 42.060 L5.940 42.060 Z"
        fill="#FFFFFF"
      />
      {/* Top Header Bar */}
      <Path
        d="M40.78,5.93H7.22A1.28,1.28,0,0,0,5.94,7.21v3.21A1.28,1.28,0,0,1,7.22,9.14H40.78a1.28,1.28,0,0,1,1.28,1.28V7.21A1.28,1.28,0,0,0,40.78,5.93Z"
        fill="#F0F0F0"
      />
      {/* Ground Shadow */}
      <Path
        d="M10.610 45.250 A13.4 1.75 0 1 0 37.410 45.250 A13.4 1.75 0 1 0 10.610 45.250 Z"
        fill="#45413c"
        opacity={shadowOpacity}
      />
      {/* Grid Lines */}
      <Path d="M5.94 13.2H42.06V34.81H5.94z" stroke="#E5E7EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
      <Path d="M5.94 20.09H42.06V27.92H5.94z" stroke="#E5E7EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />

      {/* Bar 1 (Left / Green) */}
      <Path
        d="M11.08,22h4.24a1.28,1.28,0,0,1,1.28,1.28V42.07a0,0,0,0,1,0,0H9.8a0,0,0,0,1,0,0V23.24A1.28,1.28,0,0,1,11.08,22Z"
        fill={barGreen}
      />
      <Path
        d="M15.32,22H11.08A1.28,1.28,0,0,0,9.8,23.24v2.38a1.28,1.28,0,0,1,1.28-1.28h4.24a1.28,1.28,0,0,1,1.28,1.28V23.24A1.28,1.28,0,0,0,15.32,22Z"
        fill={barGreenHi}
      />
      <Path
        d="M11.08,22h4.24a1.28,1.28,0,0,1,1.28,1.28V42.07a0,0,0,0,1,0,0H9.8a0,0,0,0,1,0,0V23.24A1.28,1.28,0,0,1,11.08,22Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />

      {/* Bar 2 (Middle / Orange) */}
      <Path
        d="M21.88,26.62h4.24A1.28,1.28,0,0,1,27.4,27.9V42.07a0,0,0,0,1,0,0H20.6a0,0,0,0,1,0,0V27.9A1.28,1.28,0,0,1,21.88,26.62Z"
        fill={barOrange}
      />
      <Path
        d="M26.12,26.62H21.88A1.28,1.28,0,0,0,20.6,27.9v2.38A1.28,1.28,0,0,1,21.88,29h4.24a1.28,1.28,0,0,1,1.28,1.28V27.9A1.28,1.28,0,0,0,26.12,26.62Z"
        fill={barOrangeHi}
      />
      <Path
        d="M21.88,26.62h4.24A1.28,1.28,0,0,1,27.4,27.9V42.07a0,0,0,0,1,0,0H20.6a0,0,0,0,1,0,0V27.9A1.28,1.28,0,0,1,21.88,26.62Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />

      {/* Bar 3 (Right / Blue) */}
      <Path
        d="M32.71,13.95h4.24a1.28,1.28,0,0,1,1.28,1.28V42.07a0,0,0,0,1,0,0h-6.8a0,0,0,0,1,0,0V15.23A1.28,1.28,0,0,1,32.71,13.95Z"
        fill={barBlue}
      />
      <Path
        d="M36.94,14H32.71a1.28,1.28,0,0,0-1.28,1.28V17.6a1.28,1.28,0,0,1,1.28-1.28h4.23a1.28,1.28,0,0,1,1.28,1.28V15.23A1.28,1.28,0,0,0,36.94,14Z"
        fill={barBlueHi}
      />
      <Path
        d="M32.71,13.95h4.24a1.28,1.28,0,0,1,1.28,1.28V42.07a0,0,0,0,1,0,0h-6.8a0,0,0,0,1,0,0V15.23A1.28,1.28,0,0,1,32.71,13.95Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />

      {/* Frame Border */}
      <Path
        d="M5.940 5.930 L42.060 5.930 L42.060 42.060 L5.940 42.060 Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
    </Svg>
  );
};
