"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import ReactPlayer from "react-player/youtube"
import { Card } from "@/components/ui/card"

interface YouTubePlayerProps {
  url: string
  loopStart: number
  loopEnd: number
  isLooping: boolean
  onTimeUpdate: (time: number) => void
  onDurationChange: (duration: number) => void
  playerRef: React.RefObject<ReactPlayer>
}

export default function YouTubePlayer({
  url,
  loopStart,
  loopEnd,
  isLooping,
  onTimeUpdate,
  onDurationChange,
  playerRef,
}: YouTubePlayerProps) {
  const intervalRef = useRef<NodeJS.Timeout>()

  // Handle time updates and looping
  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    onTimeUpdate(playedSeconds)

    // Loop logic
    if (isLooping && loopEnd > loopStart && playedSeconds >= loopEnd) {
      if (playerRef.current) {
        // Seek to start position
        playerRef.current.seekTo(loopStart, "seconds")

        // Ensure video continues playing after seek
        setTimeout(() => {
          if (playerRef.current) {
            const internalPlayer = playerRef.current.getInternalPlayer()
            if (internalPlayer && internalPlayer.playVideo) {
              internalPlayer.playVideo()
            }
          }
        }, 100)
      }
    }
  }

  // Handle duration
  const handleDuration = (duration: number) => {
    onDurationChange(duration)
  }

  // Handle when video is ready to ensure smooth playback
  const handleReady = () => {
    console.log("Video ready")
  }

  // Handle play state changes
  const handlePlay = () => {
    console.log("Video playing")
  }

  const handlePause = () => {
    console.log("Video paused")
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <Card className="p-4 bg-slate-800 border-slate-700">
      <div className="w-full rounded-lg overflow-hidden">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="400px"
          controls={true}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onPlay={handlePlay}
          onPause={handlePause}
          progressInterval={100}
          playing={true}
          config={{
            youtube: {
              playerVars: {
                autoplay: 0,
                controls: 1,
                rel: 0,
                modestbranding: 1,
              },
            },
          }}
        />
      </div>
    </Card>
  )
}
