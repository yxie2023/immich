import { stepVideoFrame } from './video-utils';

describe('stepVideoFrame', () => {
  const makeVideo = (currentTime = 1, duration = 10, paused = true) => ({ currentTime, duration, paused });

  it.each([
    [24, 1 + 1 / 24],
    [30, 1 + 1 / 30],
    [60, 1 + 1 / 60],
  ])('uses %i FPS', (fps, expected) => {
    const video = makeVideo();
    stepVideoFrame(video, fps, 1);
    expect(video.currentTime).toBe(expected);
  });

  it('falls back to 30 FPS', () => {
    const video = makeVideo();
    stepVideoFrame(video, null, 1);
    expect(video.currentTime).toBe(1 + 1 / 30);
  });

  it('does not seek while playing or with invalid metadata', () => {
    for (const video of [makeVideo(1, 10, false), makeVideo(NaN), makeVideo(1, Infinity)]) {
      const currentTime = video.currentTime;
      stepVideoFrame(video, 30, 1);
      expect(video.currentTime).toBe(currentTime);
    }
  });

  it('does not seek past either media bound', () => {
    const start = makeVideo(0);
    const end = makeVideo(10);
    stepVideoFrame(start, 30, -1);
    stepVideoFrame(end, 30, 1);
    expect(start.currentTime).toBe(0);
    expect(end.currentTime).toBe(10);
  });
});
