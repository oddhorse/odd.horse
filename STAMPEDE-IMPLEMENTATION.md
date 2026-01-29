# Stampede Button Implementation Guide

**Status:** Ready to implement
**Created:** 2026-01-26

This document contains the step-by-step implementation plan for adding the stampede button feature.

---

## Phase 1: Scaffolding (Setup)

### Step 1: Add Overlay CSS to index.njk

**File:** `src/index.njk`

**Location:** In the `<style>` block, add this **before line 220** (before the `@media` queries)

```css
/* ===== STAMPEDE OVERLAY ===== */

/**
 * Stampede horses - animated elements that gallop across screen
 * Created dynamically by stampede() function, removed after animation
 *
 * Uses existing horse walk frame images from background system
 * Positioned above all content (z-index above modals at 1000)
 * No interaction - purely decorative
 */
.stampede-horse {
	/* Position above everything (modals are z-index 1000) */
	position: fixed;
	z-index: 1100;

	/* Start offscreen left */
	left: -150px;

	/* Crisp pixel art rendering - matches background.njk */
	image-rendering: -moz-crisp-edges;
	image-rendering: -webkit-crisp-edges;
	image-rendering: pixelated;
	image-rendering: crisp-edges;

	/* No interaction - purely decorative */
	pointer-events: none;

	/* Animate across screen - duration set inline per horse for variation */
	animation: stampede-run linear forwards;
}

/**
 * Animation: run from offscreen left to offscreen right
 * Each horse has random duration (1.5-2.5s) set via inline style
 * GPU accelerated via transform (better performance than left/right)
 */
@keyframes stampede-run {
	from {
		transform: translateX(0);
	}
	to {
		/* Move across viewport plus buffer for horse width */
		transform: translateX(calc(100vw + 150px));
	}
}
```

---

### Step 2: Add Stampede Artifact Data

**File:** `src/_data/artifacts.json`

**Add this entry at the TOP of the array** (will sort newest first):

```json
{
	"id": "stampede",
	"description": "🐴 STAMPEDE 🐴",
	"url": "#",
	"type": "link",
	"dateAdded": "2026-01-26",
	"color": "#ff6b35"
},
```

**Note:** Don't forget the comma at the end!

---

### Step 3: Add Click Handler to index.njk

**File:** `src/index.njk`

**Location:** In the `<script type="module">` block (around line 287), modify it to look like this:

```html
{# Artifact tracking - only used on homepage #}
<script type="module">
	import {initArtifactTracking, wipeClickData, refreshArtifactUI} from '/assets/js/artifacts.js'
	import { playAudio, resumeAudio } from '/assets/js/audio.js'

	// Initialize artifact tracking on page load
	initArtifactTracking()

	// Expose functions to window for debugging and beta menu access
	window.wipeClickData = wipeClickData
	window.refreshArtifactUI = refreshArtifactUI

	// Stampede artifact - attach click handler
	const stampedeArtifact = document.querySelector('[data-artifact-id="stampede"]')
	if (stampedeArtifact) {
		const stampedeLink = stampedeArtifact.querySelector('.artifact-link')
		if (stampedeLink) {
			stampedeLink.addEventListener('click', (e) => {
				e.preventDefault() // Don't navigate to '#'
				stampede() // Trigger animation
			})
			console.log('✓ Stampede handler attached')
		}
	}

	/**
	 * Stampede animation - creates galloping horses across screen
	 * TODO: Implement this function (develop on test page first, then copy here)
	 */
	async function stampede() {
		console.log('🐴 STAMPEDE!')
		await resumeAudio()
		playAudio('wheel-of-fortune', { volume: 0.5 })
		// Your implementation goes here
	}
</script>
```

**Key changes:**
- Add `import { playAudio, resumeAudio } from '/assets/js/audio.js'` at the top
- Add stampede artifact selector and click handler
- Add placeholder `stampede()` function

---

### Step 4: Create Test Page

**File:** `src/test-stampede.njk` (NEW FILE)

**Full content:**

```njk
---
layout: base.njk
title: Stampede Test
eleventyExcludeFromCollections: true
---

<style>
	/* Test page UI styling */
	body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		gap: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.test-container {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 2rem;
		max-width: 600px;
		text-align: center;
	}

	h1 {
		color: white;
		margin-bottom: 1rem;
		font-size: 2.5rem;
	}

	.info {
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 2rem;
		line-height: 1.6;
		font-size: 0.95rem;
	}

	#stampede-button {
		background: #ff6b35;
		color: white;
		border: none;
		padding: 1.5rem 3rem;
		font-size: 1.5rem;
		font-weight: bold;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	#stampede-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
	}

	#stampede-button:active {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* ===== STAMPEDE OVERLAY ===== */
	/* SAME CSS AS PRODUCTION - ensures drop-in compatibility */

	.stampede-horse {
		/* Position above everything (modals are z-index 1000) */
		position: fixed;
		z-index: 1100;

		/* Start offscreen left */
		left: -150px;

		/* Crisp pixel art rendering */
		image-rendering: -moz-crisp-edges;
		image-rendering: -webkit-crisp-edges;
		image-rendering: pixelated;
		image-rendering: crisp-edges;

		/* No interaction - purely decorative */
		pointer-events: none;

		/* Animate across screen - duration set inline per horse */
		animation: stampede-run linear forwards;
	}

	@keyframes stampede-run {
		from {
			transform: translateX(0);
		}
		to {
			/* Move across viewport plus buffer */
			transform: translateX(calc(100vw + 150px));
		}
	}
</style>

<div class="test-container">
	<h1>🐴 Stampede Test 🐴</h1>
	<p class="info">
		Click the button to trigger the stampede animation.<br>
		Open browser console to see debug output.<br><br>
		<strong>Available horse images:</strong><br>
		<code>/assets/images/bg/horse-1-walk1.png</code><br>
		<code>/assets/images/bg/horse-1-walk2.png</code><br><br>
		<strong>Target:</strong> 5-15 horses (3-8 on mobile)
	</p>
	<button id="stampede-button">STAMPEDE!</button>
</div>

<script type="module">
	import { playAudio, resumeAudio } from '/assets/js/audio.js'

	/**
	 * Stampede animation - creates galloping horses across screen
	 *
	 * TODO: Implement this function!
	 *
	 * Requirements:
	 * - Spawn 5-15 horses (3-8 on mobile)
	 * - Random Y positions (10-90% of viewport height)
	 * - Random sizes (60-120px for depth variation)
	 * - Random animation durations (1.5-2.5s for speed variation)
	 * - Stagger spawns (150ms between each horse for wave effect)
	 * - Alternate frames walk1/walk2 every 150ms (gallop effect)
	 * - Remove from DOM after animation completes (cleanup!)
	 * - Play 'wheel-of-fortune' sound on trigger
	 */
	async function stampede() {
		console.log('🐴 STAMPEDE TRIGGERED!')

		// Resume audio context (required for browser autoplay policy)
		await resumeAudio()
		playAudio('wheel-of-fortune', { volume: 0.5 })

		// Determine horse count based on screen size
		const isMobile = window.innerWidth < 768
		const minHorses = isMobile ? 3 : 5
		const maxHorses = isMobile ? 8 : 15
		const horseCount = Math.floor(Math.random() * (maxHorses - minHorses + 1)) + minHorses

		console.log(`Spawning ${horseCount} horses (mobile: ${isMobile})`)

		// Horse walk frame images
		const frames = [
			'/assets/images/bg/horse-1-walk1.png',
			'/assets/images/bg/horse-1-walk2.png'
		]

		// TODO: Loop to create horses with staggered timing
		// for (let i = 0; i < horseCount; i++) {
		//   setTimeout(() => {
		//     createStampedeHorse(frames, i)
		//   }, i * 150) // 150ms stagger
		// }
	}

	/**
	 * Create a single stampede horse element
	 *
	 * TODO: Implement horse creation!
	 *
	 * Implementation hints:
	 *
	 * 1. Create <img> element with class 'stampede-horse'
	 * 2. Set src to frames[0] (start with first frame)
	 * 3. Set alt='' (decorative, hide from screen readers)
	 * 4. Random Y position: `top: ${10 + Math.random() * 80}%`
	 * 5. Random size: `width/height: ${60 + Math.random() * 60}px`
	 * 6. Random duration: `animationDuration: ${1.5 + Math.random()}s`
	 * 7. Append to document.body (starts animation immediately)
	 * 8. Start frame alternation interval (setInterval every 150ms)
	 *    - Toggle between frames[0] and frames[1]
	 * 9. Listen for 'animationend' event:
	 *    - clearInterval (stop frame switching)
	 *    - horse.remove() (clean up DOM)
	 *
	 * @param {string[]} frames - Array of image paths to alternate
	 * @param {number} index - Horse index (for logging/debugging)
	 */
	function createStampedeHorse(frames, index) {
		console.log(`Creating horse ${index + 1}`)

		// TODO: Your implementation here!

		// const horse = document.createElement('img')
		// horse.className = 'stampede-horse'
		// horse.src = frames[0]
		// horse.alt = ''
		//
		// // Random properties
		// horse.style.top = `${10 + Math.random() * 80}%`
		// horse.style.width = `${60 + Math.random() * 60}px`
		// horse.style.height = horse.style.width
		// horse.style.animationDuration = `${1.5 + Math.random()}s`
		//
		// document.body.appendChild(horse)
		//
		// // Frame alternation
		// let frameIndex = 0
		// const frameInterval = setInterval(() => {
		//   frameIndex = (frameIndex + 1) % frames.length
		//   horse.src = frames[frameIndex]
		// }, 150)
		//
		// // Cleanup
		// horse.addEventListener('animationend', () => {
		//   clearInterval(frameInterval)
		//   horse.remove()
		//   console.log(`Horse ${index + 1} finished`)
		// })
	}

	// Attach button click handler
	document.getElementById('stampede-button').addEventListener('click', stampede)

	console.log('✓ Stampede test page ready')
</script>
```

---

## Verification Steps

### After completing scaffolding:

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Serve locally:**
   ```bash
   npm run serve
   ```

3. **Check homepage** (`http://localhost:8080`):
   - [ ] Stampede artifact appears in list
   - [ ] Clicking it marks "SEEN"
   - [ ] Console shows "✓ Stampede handler attached"
   - [ ] Console shows "🐴 STAMPEDE!" on click
   - [ ] Sound plays

4. **Check test page** (`http://localhost:8080/test-stampede/`):
   - [ ] Page loads with purple gradient
   - [ ] Orange button appears
   - [ ] Console shows "✓ Stampede test page ready"
   - [ ] Clicking button logs "🐴 STAMPEDE TRIGGERED!"
   - [ ] Sound plays

---

## Phase 2: Your Implementation

Once scaffolding is verified, implement the animation on the test page:

1. Edit `src/test-stampede.njk`
2. Implement `stampede()` function (uncomment and complete the TODO loop)
3. Implement `createStampedeHorse()` function (uncomment and complete the TODO)
4. Iterate until satisfying (tweak timing, sizing, spawn logic)

**Refresh browser after each edit - no build needed!**

---

## Phase 3: Copy to Production

When happy with test page animation:

1. Copy your completed `stampede()` and `createStampedeHorse()` functions
2. Paste into `src/index.njk` (replace the placeholder `stampede()` function)
3. Build: `npm run build`
4. Test: `npm run serve`
5. Verify on homepage
6. Deploy!

---

## Implementation Hints

**Start simple:**
- Get 1 horse working before adding randomization
- Use `console.log()` liberally to track what's happening

**Key behaviors:**
- Horses spawn with stagger (150ms delay between each)
- Each horse has random Y position, size, and speed
- Frames alternate walk1/walk2 every 150ms (gallop effect)
- Horses remove themselves after animation completes

**Testing cleanup:**
- Open devtools Elements panel
- Horses should disappear from DOM after running across
- If they accumulate, your cleanup isn't working

**Mobile testing:**
- Use devtools responsive mode
- Verify fewer horses spawn (3-8 vs 5-15)

---

## Questions?

If anything is unclear or you want to adjust the approach, just ask! :3
