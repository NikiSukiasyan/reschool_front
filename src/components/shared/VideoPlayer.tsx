import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoPlayer = ({ src, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (playing) scheduleHide();
  }, [playing, scheduleHide]);

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      setStarted(true);
      scheduleHide();
    } else {
      v.pause();
      setPlaying(false);
      setControlsVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    }
  }, [scheduleHide]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const v = videoRef.current;
    if (!bar || !v || !v.duration) return;
    const { left, width } = bar.getBoundingClientRect();
    v.currentTime = ((e.clientX - left) / width) * v.duration;
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden select-none"
      onMouseMove={revealControls}
      onMouseEnter={revealControls}
      onMouseLeave={() => playing && setControlsVisible(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video object-contain cursor-pointer"
        preload="metadata"
        onClick={togglePlay}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onEnded={() => {
          setPlaying(false);
          setStarted(false);
          setCurrentTime(0);
          setControlsVisible(true);
        }}
      />

      {/* Big play overlay — shown before first play */}
      {!started && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-110 transition-transform duration-200">
            <Play size={34} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        <div className="relative px-4 pb-4 pt-10">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="w-full h-[3px] bg-white/25 rounded-full mb-3 cursor-pointer group/bar hover:h-[5px] transition-all duration-150"
            onClick={seek}
          >
            <div
              className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-full relative transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[13px] h-[13px] bg-white rounded-full shadow-md -mr-[6px] opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="text-white/80 hover:text-[#a78bfa] transition-colors"
            >
              {playing ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
            </button>

            <button
              onClick={toggleMute}
              className="text-white/80 hover:text-[#a78bfa] transition-colors"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <span className="text-white/60 text-xs font-mono flex-1 tabular-nums">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            <button
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-[#a78bfa] transition-colors"
            >
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
