"use client"

import LoopControls from "@/components/LoopControls"
import YouTubePlayer from "@/components/YoutubePlayer"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import type ReactPlayer from "react-player/youtube"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [loopStart, setLoopStart] = useState(0)
  const [loopEnd, setLoopEnd] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const playerRef = useRef<ReactPlayer>(null!)

  const handleLoad = () => setVideoUrl(url)

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">YouTube Looper</h1>
          <p className="text-slate-400">Set custom loop points for any YouTube video</p>
        </div>

        {/* URL Input */}
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="flex gap-2">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Please paste YouTube URL or Video ID"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Button onClick={handleLoad} className="bg-red-600 hover:bg-red-700">
              Load
            </Button>
          </div>
        </Card>

        {videoUrl && (
          <>
            <YouTubePlayer
              url={videoUrl}
              loopStart={loopStart}
              loopEnd={loopEnd}
              isLooping={isLooping}
              onTimeUpdate={setCurrentTime}
              onDurationChange={setDuration}
              playerRef={playerRef}
            />
            <LoopControls
              loopStart={loopStart}
              loopEnd={loopEnd}
              currentTime={currentTime}
              duration={duration}
              isLooping={isLooping}
              onStartChange={setLoopStart}
              onEndChange={setLoopEnd}
              onLoopToggle={setIsLooping}
              onSetStartFromPlayer={() => setLoopStart(Math.floor(currentTime))}
              onSetEndFromPlayer={() => setLoopEnd(Math.floor(currentTime))}
              onClear={() => {
                setLoopStart(0)
                setLoopEnd(duration)
                setIsLooping(false)
              }}
              playerRef={playerRef}
            />
          </>
        )}
      </div>
    </div>
  )
}