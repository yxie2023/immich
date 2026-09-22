# Render frames during held-key stepping

## Summary

- Keep native OS keyboard repeat for `,` and `.`.
- Apply seek backpressure so each completed seek can render before another frame step is accepted.

## Implementation changes

- Have the frame-stepping utility skip new frame seeks while `HTMLVideoElement.seeking` is true.
- Continue pausing immediately and preserve FPS fallback, bounds clamping, casting guards, and single-press behavior.
- Document why overlapping seeks are skipped and update `XIE.md` with the held-key behavior.
- Do not add application timers or keyup listeners.

## Public interfaces

- The internal video utility type gains the existing `seeking` property.
- No public API, schema, or shortcut-action changes.

## Test plan

- Verify repeated calls during an active seek do not replace the pending seek.
- Verify stepping resumes after the seek completes.
- Run the frame-stepping unit tests and web type checks.
- Manually verify held backward and forward stepping in a browser when available.

## Assumptions

- Native keyboard repeat controls the delay and cadence.
- Slow decoding may skip repeat ticks instead of queuing delayed steps.
