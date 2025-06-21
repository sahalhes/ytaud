"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Clock, StopCircle } from "lucide-react"
import type ReactPlayer from "react-player/youtube"

interface LoopControlsProps {
  loopStart: number
  loopEnd: number
  currentTime: number
  duration: number
  isLooping: boolean
  onStartChange: (start: number) => void
  onEndChange: (end: number) => void
  onLoopToggle: (loop: boolean) => void
  onSetStartFromPlayer: () => void
  onSetEndFromPlayer: () => void
  onClear: () => void
  playerRef: React.RefObject<ReactPlayer>
}

export default function LoopControls({
  loopStart,
  loopEnd,
  currentTime,
  duration,
  isLooping,
  onStartChange,
  onEndChange,
  onLoopToggle,
  onSetStartFromPlayer,
  onSetEndFromPlayer,
  onClear,
  playerRef,
}: LoopControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSettingStart, setIsSettingStart] = useState(false)
  const [isSettingEnd, setIsSettingEnd] = useState(false)

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Play/Pause controls
  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.getInternalPlayer().pauseVideo()
        setIsPlaying(false)
      } else {
        playerRef.current.getInternalPlayer().playVideo()
        setIsPlaying(true)
      }
    }
  }

  // Restart video
  const restartVideo = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(isLooping ? loopStart : 0, "seconds")
    }
  }

  // Seek to specific time
  const seekTo = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, "seconds")
    }
  }

  // Set loop start point
  const setLoopStartPoint = () => {
    onSetStartFromPlayer()
    setIsSettingStart(false)

    // If end point is before start point, reset it
    if (loopEnd <= currentTime) {
      onEndChange(duration)
    }
  }

  // Set loop end point
  const setLoopEndPoint = () => {
    onSetEndFromPlayer()
    setIsSettingEnd(false)

    // If start point is after end point, reset it
    if (loopStart >= currentTime) {
      onStartChange(0)
    }
  }

  // Toggle loop mode
  const toggleLoop = () => {
    const newLoopState = !isLooping
    onLoopToggle(newLoopState)

    // When enabling loop, jump to start point if we have valid loop points
    if (newLoopState && playerRef.current && loopStart < loopEnd) {
      playerRef.current.seekTo(loopStart, "seconds")
    }
  }

  return (
    <Card className="p-6 bg-slate-800 border-slate-700">
      {/* Time Display */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-slate-400">{formatTime(currentTime)}</span>
        <span className="text-sm text-slate-400">{formatTime(duration)}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={([value]) => seekTo(value)}
          className="w-full"
        />

        {/* Loop indicators */}
        {isLooping && loopStart > 0 && loopEnd < duration && (
          <div className="relative mt-2 h-2">
            <div
              className="absolute h-full bg-pink-500 rounded"
              style={{
                left: `${(loopStart / duration) * 100}%`,
                width: `${((loopEnd - loopStart) / duration) * 100}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={togglePlayPause}
          variant="outline"
          size="lg"
          className="bg-slate-700 border-slate-600 hover:bg-slate-600"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>

        <Button
          onClick={restartVideo}
          variant="outline"
          size="lg"
          className="bg-slate-700 border-slate-600 hover:bg-slate-600"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => setIsSettingStart(true)}
          onDoubleClick={setLoopStartPoint}
          variant={isSettingStart ? "default" : "outline"}
          size="lg"
          className={`${
            isSettingStart ? "bg-green-600 hover:bg-green-700" : "bg-slate-700 border-slate-600 hover:bg-slate-600"
          }`}
        >
          <Clock className="w-5 h-5 mr-2" />
          {isSettingStart ? "Click to Set Start" : "Set Start"}
        </Button>

        <Button
          onClick={() => setIsSettingEnd(true)}
          onDoubleClick={setLoopEndPoint}
          variant={isSettingEnd ? "default" : "outline"}
          size="lg"
          className={`${
            isSettingEnd ? "bg-red-600 hover:bg-red-700" : "bg-slate-700 border-slate-600 hover:bg-slate-600"
          }`}
        >
          <StopCircle className="w-5 h-5 mr-2" />
          {isSettingEnd ? "Click to Set End" : "Set End"}
        </Button>

        <Button
          onClick={toggleLoop}
          variant={isLooping ? "default" : "outline"}
          size="lg"
          className={`${
            isLooping ? "bg-pink-600 hover:bg-pink-700" : "bg-slate-700 border-slate-600 hover:bg-slate-600"
          }`}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {isLooping ? "Loop ON" : "Loop OFF"}
        </Button>

        <Button
          onClick={onClear}
          variant="outline"
          size="lg"
          className="bg-slate-700 border-slate-600 hover:bg-slate-600"
        >
          <StopCircle className="w-5 h-5 mr-2" />
          Clear
        </Button>
      </div>

      {/* Loop Info */}
      {loopStart > 0 || loopEnd < duration ? (
        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
          <div className="text-sm text-center">
            <span className="text-green-400">Loop Start: {formatTime(loopStart)}</span>
            <span className="mx-4 text-slate-400">→</span>
            <span className="text-red-400">Loop End: {formatTime(loopEnd)}</span>
            {isLooping && <span className="block mt-1 text-pink-400">🔄 Looping Active</span>}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
          <div className="text-sm text-center text-slate-400">
            No loop points set. Use "Set Start" and "Set End" to create a loop.
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-xs text-slate-400 text-center space-y-1">
        <p>Double-click "Set Start" to mark loop beginning</p>
        <p>Double-click "Set End" to mark loop ending</p>
        <p>Enable "Loop" to repeat between your marked points</p>
      </div>
    </Card>
  )
}
