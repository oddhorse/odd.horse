# Rhythm Game Planning Doc

## Overview

**Goal:** osu!mania-style rhythm game integrated into odd.horse website

**Core concept:** Vertical scrolling rhythm game where notes fall down multiple lanes and player must hit them in time with the music

**Purpose:** Interactive music experience, showcase oddhorse tracks in playable format

---

## Core Mechanics

### Game Structure

- **Lanes:** 4-7 vertical lanes (configurable per song)
- **Notes:** Fall from top of screen toward hit line at bottom
- **Timing:** Hit notes when they cross the judgment line (perfect/good/miss)
- **Scoring:** Accuracy-based scoring with combo multiplier
- **Judgment:** Multiple timing windows (perfect < 50ms, good < 100ms, ok < 150ms, miss)

### Controls

- **Desktop:** Keyboard (D/F/J/K for 4-lane, or custom mappings)
- **Mobile:** Touch zones per lane (tap when note reaches line)

### Visual Feedback

- Hit effects (particle bursts, flashes)
- Combo counter
- Accuracy display
- Score counter
- Lane press effects

---

## Technical Approach

### Framework

**Use Canvas API for rendering:**
- High performance for scrolling notes
- Smooth animations
- Custom visual effects
- Similar to existing background.njk canvas animation

**Audio synchronization:**
- Web Audio API for precise timing
- Preload audio buffer
- Calculate note positions based on currentTime
- Account for audio latency/offset calibration

### File Structure

```
src/
├── rhythm-game/
│   ├── index.njk          # Game page template
│   ├── game.js            # Core game loop and rendering
│   ├── audio.js           # Audio engine and timing
│   ├── beatmap.js         # Beatmap parser and note data
│   ├── input.js           # Keyboard/touch input handling
│   ├── scoring.js         # Scoring and judgment logic
│   └── ui.js              # UI overlays (score, combo, etc)
├── assets/
│   ├── beatmaps/
│   │   └── [song-id].json # Beatmap files
│   └── audio/
│       └── [song-id].mp3  # Audio files
```

### Data Format (Beatmap JSON)

```json
{
  "metadata": {
    "title": "Song Title",
    "artist": "oddhorse",
    "charter": "oddhorse",
    "difficulty": "normal",
    "bpm": 140,
    "offset": 0
  },
  "lanes": 4,
  "notes": [
    { "time": 1000, "lane": 0 },
    { "time": 1250, "lane": 1 },
    { "time": 1500, "lane": 2 }
  ]
}
```

### Rendering Loop

```
1. Calculate scroll offset based on audio time
2. Filter visible notes (on screen)
3. Draw lanes
4. Draw notes at calculated Y positions
5. Draw hit line
6. Draw UI overlays
7. Request next frame
```

---

## Visual Design

### Aesthetic Integration

- Match odd.horse visual language
- Use page color system (--page-color)
- Animated background (horse canvas or variant?)
- Clean, minimal UI
- FT88 font for scoring/UI text
- Karrik font for menus

### Lane Design

- Simple vertical lanes with subtle dividers
- Hit line: bright, clear, contrasting
- Notes: simple shapes (rectangles/circles)
- Hit effects: bursts, flashes matching page color

### UI Layout

```
┌─────────────────────────┐
│   COMBO: 127x           │
│   SCORE: 45,320         │
│   ACCURACY: 98.4%       │
├─────────────────────────┤
│                         │
│    ↓ ↓ ↓ ↓ (notes)     │
│                         │
│    │ │ │ │ (lanes)     │
│                         │
│   ═══════════ (hit)     │
│    D F J K (keys)       │
└─────────────────────────┘
```

---

## Audio/Timing Synchronization

### Critical Challenges

1. **Audio latency:** Browser audio has ~20-50ms latency
2. **Visual offset:** Rendering can lag behind audio
3. **User calibration:** Different devices have different latency

### Solutions

- Global offset setting (user-adjustable)
- Calibration mode (hit metronome beats, calculate offset)
- Use `performance.now()` for frame timing
- Sync to `AudioContext.currentTime` not `Date.now()`

### Timing Formula

```javascript
// Note Y position based on audio time
const scrollSpeed = 500 // pixels per second
const timeUntilHit = note.time - audioContext.currentTime
const noteY = hitLineY - (timeUntilHit * scrollSpeed)
```

---

## Implementation Phases

### Phase 1: Proof of Concept (MVP)

- [ ] Single page with canvas game area
- [ ] 4-lane layout with falling notes
- [ ] Keyboard input (D/F/J/K)
- [ ] Basic judgment (hit/miss)
- [ ] Simple scoring
- [ ] Audio playback synchronized to notes
- [ ] One test beatmap

**Tech:** Canvas API, Web Audio API, basic JSON beatmap

### Phase 2: Core Features

- [ ] Timing windows (perfect/good/ok/miss)
- [ ] Combo system
- [ ] Accuracy calculation
- [ ] Hit effects (visual feedback)
- [ ] Lane press animations
- [ ] Results screen at end
- [ ] Multiple beatmaps/songs

### Phase 3: Polish & Integration

- [ ] User offset calibration
- [ ] Settings menu (scroll speed, visual options)
- [ ] Song select screen
- [ ] Integration with odd.horse design system
- [ ] Animated background
- [ ] Mobile touch controls
- [ ] Responsive layout

### Phase 4: Advanced Features (Optional)

- [ ] Hold notes (long notes)
- [ ] Different lane counts per song (4k/5k/7k)
- [ ] Difficulty levels per song
- [ ] Replays
- [ ] Leaderboards (local storage)
- [ ] Practice mode (slow down, specific sections)

---

## Beatmap Creation Workflow

### Tools Needed

- **Charting tool:** Either build custom editor OR use existing tool + converter
- **Options:**
  1. Build simple web-based editor
  2. Use osu! editor + write converter script
  3. Manual JSON editing (tedious but possible)

### Recommended Approach

Start with **manual JSON editing** for first few maps, build editor later if needed.

**Workflow:**
1. Load song in audio editor (Ableton)
2. Note BPM and timing
3. Manually write note timings in JSON
4. Test in-game, adjust offset if needed

---

## Questions & Decisions

### To Decide

- [ ] Default lane count? (4 lanes recommended for simplicity)
- [ ] Scoring algorithm? (accuracy-based, combo multiplier)
- [ ] Which oddhorse songs to chart first?
- [ ] Allow user-submitted beatmaps?
- [ ] Show as separate page or modal overlay?
- [ ] Include tutorial/how-to-play?

### Technical Unknowns

- [ ] Audio latency on mobile browsers (needs testing)
- [ ] Canvas performance on lower-end devices
- [ ] Best approach for touch controls (full-screen zones vs buttons?)

---

## References

- [osu!mania](https://osu.ppy.sh/wiki/en/Game_mode/osu!mania) - reference mechanics
- [Web Audio API timing](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## Next Steps

1. Build Phase 1 MVP with one test song
2. Test timing accuracy and audio sync
3. Iterate on feel/timing windows
4. Chart 2-3 oddhorse songs
5. Integrate into site design
6. Polish and release
