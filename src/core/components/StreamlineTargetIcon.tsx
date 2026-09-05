import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface StreamlineTargetIconProps {
  size?: number;
  focused?: boolean;
}

export const StreamlineTargetIcon: React.FC<StreamlineTargetIconProps> = ({
  size = 24,
  focused = true,
}) => {
  const outerRed = focused ? '#FF6242' : '#D1D5DB';
  const outerRedHi = focused ? '#FF866E' : '#E5E7EB';
  const arrowBlue = focused ? '#00B8F0' : '#6B7280';
  const arrowBlueHi = focused ? '#4ACFFF' : '#9CA3AF';
  const strokeColor = focused ? '#45413C' : '#9CA3AF';
  const shadowOpacity = focused ? 0.15 : 0.08;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Outer Ring Red */}
      <Path
        d="M5.390 24.000 A18.610 18.610 0 1 0 42.610 24.000 A18.610 18.610 0 1 0 5.390 24.000 Z"
        fill={outerRed}
      />
      {/* Outer Ring Highlight */}
      <Path
        d="M24,9.18A18.62,18.62,0,0,1,42.52,25.9c.06-.63.09-1.26.09-1.9A18.61,18.61,0,0,0,5.39,24c0,.64,0,1.27.09,1.9A18.62,18.62,0,0,1,24,9.18Z"
        fill={outerRedHi}
      />
      {/* Outer Ring Stroke */}
      <Path
        d="M5.390 24.000 A18.610 18.610 0 1 0 42.610 24.000 A18.610 18.610 0 1 0 5.390 24.000 Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      {/* White Ring */}
      <Path
        d="M9.900 24.000 A14.100 14.100 0 1 0 38.100 24.000 A14.100 14.100 0 1 0 9.900 24.000 Z"
        fill="#FFFFFF"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      {/* Middle Red Ring */}
      <Path
        d="M14.410 24.000 A9.590 9.590 0 1 0 33.590 24.000 A9.590 9.590 0 1 0 14.410 24.000 Z"
        fill={outerRed}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      {/* Center White Dot */}
      <Path
        d="M19.490 24.000 A4.510 4.510 0 1 0 28.510 24.000 A4.510 4.510 0 1 0 19.490 24.000 Z"
        fill="#FFFFFF"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      {/* Arrow Shaft */}
      <Path
        d="M38.24,38a1.12,1.12,0,0,1-1.59,0L23.49,24.8a1.13,1.13,0,0,1,0-1.6,1.12,1.12,0,0,1,1.59,0L38.24,36.36A1.13,1.13,0,0,1,38.24,38Z"
        fill={arrowBlue}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      {/* Arrow Fletching */}
      <Path
        d="M30.27,28.38s6.65-1.76,10.37.8c3.54,2.45,1.72,5.76-.8,6.38-2.08.52-4-1.59-4-1.59Z"
        fill={arrowBlue}
      />
      <Path
        d="M40.64,32a5,5,0,0,1,1.61,1.73c.69-1.32.49-3.07-1.61-4.52-3.72-2.56-10.37-.8-10.37-.8l2.36,2.36C34.9,30.46,38.34,30.38,40.64,32Z"
        fill={arrowBlueHi}
      />
      <Path
        d="M30.27,28.38s6.65-1.76,10.37.8c3.54,2.45,1.72,5.76-.8,6.38-2.08.52-4-1.59-4-1.59Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      {/* Ground Shadow */}
      <Path
        d="M11.030 45.310 A12.97 1.69 0 1 0 36.970 45.310 A12.97 1.69 0 1 0 11.030 45.310 Z"
        fill="#45413c"
        opacity={shadowOpacity}
      />
    </Svg>
  );
};
