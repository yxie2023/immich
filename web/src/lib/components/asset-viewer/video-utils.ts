const FALLBACK_FPS = 30;

type VideoElement = Pick<HTMLVideoElement, 'currentTime' | 'duration' | 'pause' | 'seeking'>;

export const stepVideoFrame = (video: VideoElement, fps: number | null | undefined, direction: -1 | 1) => {
  video.pause();
  // Browsers coalesce overlapping seeks and may not render a frame until input stops.
  if (video.seeking) {
    return;
  }

  const { currentTime, duration } = video;
  if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration < 0) {
    return;
  }

  const frameRate = typeof fps === 'number' && Number.isFinite(fps) && fps > 0 ? fps : FALLBACK_FPS;
  video.currentTime = Math.min(Math.max(currentTime + direction / frameRate, 0), duration);
};
