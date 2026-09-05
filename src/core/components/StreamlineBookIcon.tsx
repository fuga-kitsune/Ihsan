import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface StreamlineBookIconProps {
  size?: number;
  focused?: boolean;
}

export const StreamlineBookIcon: React.FC<StreamlineBookIconProps> = ({
  size = 24,
  focused = true,
}) => {
  const coverColor = focused ? '#00b8f0' : '#D1D5DB';
  const coverHighlight = focused ? '#4acfff' : '#E5E7EB';
  const spineColor = focused ? '#627b8c' : '#9CA3AF';
  const strokeColor = focused ? '#45413c' : '#9CA3AF';
  const pageBase = focused ? '#fffef2' : '#F9FAFB';
  const pageHighlight = '#FFFFFF';
  const pageCrease = focused ? '#fffce5' : '#F3F4F6';
  const shadowOpacity = focused ? 0.15 : 0.08;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Cover Base */}
      <Path
        d="M43,10.41,26,9.6v1.57H22V9.6L5,10.41a2,2,0,0,0-1.9,2v27a2,2,0,0,0,2.13,2l13.44-.81a1,1,0,0,1,.95.54c.26.66,1,.91,1.89.91h5c.88,0,1.63-.25,1.89-.91a1,1,0,0,1,.95-.54l13.44.81a2,2,0,0,0,2.13-2v-27A2,2,0,0,0,43,10.41Z"
        fill={coverColor}
      />
      {/* Cover Top Highlight */}
      <Path
        d="M43,10.41,26,9.6v1.57H22V9.6L5,10.41a2,2,0,0,0-1.9,2v3.5a2,2,0,0,1,1.9-2L24,13l19,.91a2,2,0,0,1,1.9,2V12.4A2,2,0,0,0,43,10.41Z"
        fill={coverHighlight}
      />
      {/* Cover Stroke */}
      <Path
        d="M43,10.41,26,9.6v1.57H22V9.6L5,10.41a2,2,0,0,0-1.9,2v27a2,2,0,0,0,2.13,2l13.44-.81a1,1,0,0,1,.95.54c.26.66,1,.91,1.89.91h5c.88,0,1.63-.25,1.89-.91a1,1,0,0,1,.95-.54l13.44.81a2,2,0,0,0,2.13-2v-27A2,2,0,0,0,43,10.41Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      {/* Spine Bottom */}
      <Path
        d="M21,36h6a0,0,0,0,1,0,0v2a1.54,1.54,0,0,1-1.54,1.54H22.54A1.54,1.54,0,0,1,21,38V36A0,0,0,0,1,21,36Z"
        fill={spineColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
      />
      {/* Ground Shadow */}
      <Path
        d="M7.000 43.500 A17 1.5 0 1 0 41.000 43.500 A17 1.5 0 1 0 7.000 43.500 Z"
        fill="#45413c"
        opacity={shadowOpacity}
      />
      {/* Page Edges */}
      <Path d="M8.59,9.5,6.43,12.24a2.05,2.05,0,0,0-.34,1.13V39l2.5-3.67Z" fill={pageBase} />
      <Path d="M39.41,9.5l2.16,2.74a2.05,2.05,0,0,1,.34,1.13V39l-2.5-3.67Z" fill={pageBase} />
      <Path d="M6.43,12.24a2.05,2.05,0,0,0-.34,1.13v3.5a2.05,2.05,0,0,1,.34-1.13L8.59,13V9.5Z" fill={pageHighlight} />
      <Path d="M41.57,12.24,39.41,9.5V13l2.16,2.74a2.05,2.05,0,0,1,.34,1.13v-3.5A2.05,2.05,0,0,0,41.57,12.24Z" fill={pageHighlight} />
      <Path d="M8.59,9.5,6.43,12.24a2.05,2.05,0,0,0-.34,1.13V39l2.5-3.67Z" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />
      <Path d="M39.41,9.5l2.16,2.74a2.05,2.05,0,0,1,.34,1.13V39l-2.5-3.67Z" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />

      {/* Pages Body */}
      <Path d="M24,37V11a3,3,0,0,0-3-3L9.5,8.92a1.52,1.52,0,0,0-.91.58v29l12.63-.4A3.42,3.42,0,0,1,24,37Z" fill={pageBase} />
      <Path d="M27,8a3,3,0,0,0-3,3V37a3.42,3.42,0,0,1,2.78,1.1l12.63.4V9.5a1.52,1.52,0,0,0-.91-.58Z" fill={pageBase} />
      <Path d="M21,8,9.5,8.92a1.52,1.52,0,0,0-.91.58v2.92a1,1,0,0,1,.91-1L21,10.5a3,3,0,0,1,3,3V11A3,3,0,0,0,21,8Z" fill={pageHighlight} />
      <Path d="M38.5,8.92,27,8a3,3,0,0,0-3,3v2.5a3,3,0,0,1,3-3l11.5.92a1,1,0,0,1,.91,1V9.5A1.52,1.52,0,0,0,38.5,8.92Z" fill={pageHighlight} />
      <Path d="M24,37V11a3,3,0,0,0-3-3L9.5,8.92a1.52,1.52,0,0,0-.91.58v29l12.63-.4A3.42,3.42,0,0,1,24,37Z" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />
      <Path d="M27,8a3,3,0,0,0-3,3V37a3.42,3.42,0,0,1,2.78,1.1l12.63.4V9.5a1.52,1.52,0,0,0-.91-.58Z" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />

      {/* Pages Bottom Crease */}
      <Path d="M24,37A3,3,0,0,0,21,34.5l-12.41.83L6.09,39l15.09-.83A3.34,3.34,0,0,1,24,37Z" fill={pageCrease} stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />
      <Path d="M26.82,38.17,41.91,39l-2.5-3.67L27,34.5A3,3,0,0,0,24.05,37,3.34,3.34,0,0,1,26.82,38.17Z" fill={pageCrease} stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} />

      {/* Text Line Details */}
      <Path d="M20.5 15.33L11.5 16.19" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
      <Path d="M20.5 20.01L11.5 20.87" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
      <Path d="M20.5 24.69L11.5 25.55" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
      <Path d="M20.5 29.37L11.5 30.23" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />

      <Path d="M27.5 15.33L36.5 16.19" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
      <Path d="M27.5 20.01L36.5 20.87" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
      <Path d="M27.5 24.69L36.5 25.55" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
      <Path d="M27.5 29.37L36.5 30.23" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
    </Svg>
  );
};
