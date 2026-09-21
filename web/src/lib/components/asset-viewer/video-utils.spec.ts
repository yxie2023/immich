import { stepVideoFrame } from './video-utils';

describe('stepVideoFrame', () => {
  const makeVideo = (currentTime = 1, duration = 10) => ({ currentTime, duration, pause: vi.fn() });

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

  it('pauses playback before seeking', () => {
    const events: string[] = [];
    let currentTime = 1;
    const video = {
      duration: 10,
      get currentTime() {
        return currentTime;
      },
      set currentTime(value: number) {
        events.push('seek');
        currentTime = value;
      },
      pause: () => {
        events.push('pause');
      },
    };

    stepVideoFrame(video, 30, 1);
    expect(events).toEqual(['pause', 'seek']);
  });

  it('does not seek with invalid metadata', () => {
    for (const video of [makeVideo(NaN), makeVideo(1, Infinity)]) {
      const currentTime = video.currentTime;
      stepVideoFrame(video, 30, 1);
      expect(video.currentTime).toBe(currentTime);
      expect(video.pause).toHaveBeenCalledOnce();
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
