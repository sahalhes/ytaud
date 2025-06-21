'use client';

type Props = {
  loopStart: number;
  loopEnd: number;
  onStartChange: (val: number) => void;
  onEndChange: (val: number) => void;
  onSetStartFromPlayer: () => void;
  onSetEndFromPlayer: () => void;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const LoopControls: React.FC<Props> = ({
  loopStart,
  loopEnd,
  onStartChange,
  onEndChange,
  onSetStartFromPlayer,
  onSetEndFromPlayer,
}) => {
  return (
    <div style={{ marginTop: 20 }}>
      <div>
        <label>Start Time (s): </label>
        <input type="number" value={loopStart} onChange={(e) => onStartChange(Number(e.target.value))} />
        <button onClick={onSetStartFromPlayer}>Set from Player</button>
      </div>
      <div>
        <label>End Time (s): </label>
        <input type="number" value={loopEnd} onChange={(e) => onEndChange(Number(e.target.value))} />
        <button onClick={onSetEndFromPlayer}>Set from Player</button>
      </div>
      <p>
        🔁 Looping from <strong>{formatTime(loopStart)}</strong> to <strong>{formatTime(loopEnd)}</strong>
      </p>
    </div>
  );
};

export default LoopControls;
