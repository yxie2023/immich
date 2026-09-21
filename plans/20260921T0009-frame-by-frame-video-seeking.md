# Frame-by-frame video seeking

## Summary

- Implement best-effort frame seeking in the current native asset player using source FPS metadata, with a 30 FPS fallback.
- Pressing `,` or `.` pauses active playback, then steps backward or forward one frame.

## Implementation changes

- Add nullable `fps` to the public EXIF response schema and map it from the existing database field. Regenerate the OpenAPI specification and TypeScript SDK so `asset.exifInfo?.fps` is typed.
- Add a tested web utility that seeks by `currentTime +/- 1 / fps`, accepts only finite positive FPS values, falls back to 30 FPS, and clamps the result to `[0, duration]`.
- Extend the existing shortcut list in `VideoNativeViewer.svelte`:
  - Pause active playback before seeking; ignore shortcuts while casting, before media metadata loads, or when time or duration is invalid.
  - Map `,` to one frame backward and `.` to one frame forward.
  - Preserve the existing seek event handling so Media Chrome and HLS time displays update immediately.
  - Prevent the handled keys' default behavior and retain normal input-field filtering.
- Add the shortcuts to the keyboard-shortcuts modal with English translation entries.
- Do not include the old branch's test-assets submodule change.

## Public interfaces

- `ExifResponseDto` gains `fps?: number | null`.
- No database migration or new endpoint is required.
- Metadata-stripped responses and motion-photo cases without video FPS use the 30 FPS fallback.

## Test plan

- Server DTO test: numeric and null FPS values map correctly into the asset EXIF response.
- Web tests: 24, 30, and 60 FPS; invalid or missing FPS fallback; pause-then-step behavior; forward and backward calculations; start and end clamping; invalid time or duration rejection.
- Run server DTO tests, web unit and type/Svelte checks, targeted linting, and SDK compilation.
- Manually verify progressive playback and realtime HLS when a browser environment is available.

## Assumptions

- Scope is `VideoNativeViewer`, covering normal, stacked, and motion-photo asset viewing. Memories, panorama playback, and remote casting are excluded.
- Browser timestamp seeking cannot guarantee exact adjacent decoded frames for variable-frame-rate media. Source average FPS provides correct intervals for constant-rate media and best-effort behavior otherwise.
