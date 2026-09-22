# XIE handoff

## Baseline and branch

- Base: `v3.2.2` (`60b51cb3bc909e72fe963f4dfb1947515cb9ab3b`)
- Custom branch: `20260920-3.2.2-xie` (`4a19ff36c1df49a6a3e968cce9b02093b4461628`)
- The custom branch is a linear three-commit descendant of the base, with 10 changed files and 156 insertions.

The added commits are:

1. `0d552cae8` - add frame-by-frame video seeking.
2. `192bca9d8` - pause before stepping video frames.
3. `4a19ff36c` - add the video mute shortcut.

## Custom behavior

In the native asset video viewer:

- `,` pauses and steps backward by one frame.
- `.` pauses and steps forward by one frame.
- `m` toggles mute.

Frame stepping uses `asset.exifInfo?.fps` when it is finite and positive, otherwise it assumes 30 FPS. The target time is clamped to `[0, duration]`. Frame stepping is disabled before metadata loads and while casting; mute toggling is also disabled while casting.

Holding `,` or `.` continues stepping at the operating system's keyboard-repeat cadence. New repeat events are ignored while the browser is still seeking so overlapping seeks cannot be coalesced into a single frame update after key release.

Seeking by `HTMLMediaElement.currentTime` is best-effort. It cannot guarantee the adjacent decoded frame for variable-frame-rate media, HLS, or transcoded playback because source average FPS may not match playback frame timing.

## API and supporting changes

- The existing EXIF `fps` field is exposed as nullable `ExifResponseDto.fps` in the server response schema, OpenAPI specification, and TypeScript SDK.
- English shortcut labels were added to `i18n/en.json` and the shortcuts modal.
- No database migration or new endpoint was added.

Unit tests cover EXIF mapping, FPS values and fallback, pause-before-seek ordering, active-seek backpressure, invalid media metadata, and media-bound clamping. The targeted server and web tests pass.

See [`plans/20260921T0009-frame-by-frame-video-seeking.md`](plans/20260921T0009-frame-by-frame-video-seeking.md) for the original feature scope and [`plans/20260922T2327-held-frame-stepping.md`](plans/20260922T2327-held-frame-stepping.md) for held-key seek backpressure.
