'use client';

import React, { useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';

type Props = {
  url: string;
  loopStart: number;
  loopEnd: number;
  playerRef: React.RefObject<ReactPlayer | null>;
  onTimeUpdate: (current: number) => void;
};


const YouTubePlayer: React.FC<Props> = ({ url, loopStart, loopEnd, playerRef, onTimeUpdate }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const current = playerRef.current.getCurrentTime?.() || 0;
        onTimeUpdate(current);
        if (loopEnd > 0 && current >= loopEnd) {
          playerRef.current.seekTo(loopStart, 'seconds');
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [loopStart, loopEnd]);

  return (
    <div style={{ marginTop: 20 }}>
      <ReactPlayer ref={playerRef} url={url} controls playing width="100%" />
    </div>
  );
};

export default YouTubePlayer;
