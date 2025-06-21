'use client';

import LoopControls from '@/components/LoopControls';
import YouTubePlayer from '@/components/YoutubePlayer';
import { useRef, useState } from 'react';

import ReactPlayer from 'react-player/youtube';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  const handleLoad = () => setVideoUrl(url);

  return (
    <div>
      <h1>YouTube Looper</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste YouTube URL"
        style={{ width: '60%' }}
      />
      <button onClick={handleLoad} style={{ marginLeft: '10px' }}>
        Load Video
      </button>

      {videoUrl && (
        <>
          <YouTubePlayer
            url={videoUrl}
            loopStart={loopStart}
            loopEnd={loopEnd}
            onTimeUpdate={setCurrentTime}
            playerRef={playerRef}
          />
          <LoopControls
            loopStart={loopStart}
            loopEnd={loopEnd}
            onStartChange={setLoopStart}
            onEndChange={setLoopEnd}
            onSetStartFromPlayer={() => setLoopStart(Math.floor(currentTime))}
            onSetEndFromPlayer={() => setLoopEnd(Math.floor(currentTime))}
          />
        </>
      )}
    </div>
  );
}
