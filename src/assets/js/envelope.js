/**
 * envelope.js
 * Red envelope (hongbao) artifact — state machine, image animation, persistence.
 *
 * Click sequence:
 *   IDLE (float) → SHAKING (jitter + grow, 2.5s CSS) → brief pause at max size
 *   → RUSH (shrink + fly to bottom, 0.4s JS transition) → REVEAL (card bounces in)
 *   → OPENED (persisted to localStorage)
 *
 * Shake is two CSS animations via the .shaking class: jitter on translate,
 * grow on scale. These use the individual CSS transform properties so they
 * don't conflict with each other.
 *
 * Rush is driven by JS inline transitions, NOT a CSS class. Reason: the shake
 * animation holds scale:1.4 via forwards fill. Removing .shaking drops that
 * fill and scale snaps back to 1. We need to "hand off" cleanly — see
 * startRush() for the exact technique.
 *
 * Image swap: if IMG_OPEN differs from IMG_CLOSED, src swaps to the
 * open-flap image when the rush begins. Drop both files into
 * src/assets/images/envelope/ and update the constants below.
 *
 * Reset button: always active. Clears localStorage and reloads.
 */

// ===== LOOT POOL =====
// Extensible — push items here. url is optional; shows "claim →" if set.
const LOOT_POOL = [
	{ id: 'horse-bucks-100', label: '100 Horse Bucks', emoji: '💵', url: null },
	{ id: 'horse-bucks-500', label: '500 Horse Bucks', emoji: '💰', url: null },
	{ id: 'horse-bucks-1000', label: '1000 Horse Bucks', emoji: '🏦', url: null },
]

// ===== CONSTANTS =====
const STORAGE_KEY = 'oddhorse-envelope-result'
const SHAKE_DURATION = 2500   // ms — must match CSS jitter/grow animation duration
const RUSH_DURATION = 400    // ms — envelope flies to bottom

// Image paths — drop your files into src/assets/images/envelope/
// If IMG_OPEN === IMG_CLOSED, no swap happens during rush.
const IMG_CLOSED = '/assets/images/envelope/closed.png'
const IMG_OPEN = '/assets/images/envelope/open.png'

// ===== DOM REFS =====
let wrapper = null  // .envelope-wrapper — state classes live here
let img = null  // .envelope-img — the envelope
let hint = null  // .envelope-hint — "tap to open"
let revealCard = null  // .reveal-card
let revealEmoji = null  // .reveal-emoji
let revealLabel = null  // .reveal-label
let revealClaim = null  // .reveal-claim (optional link)
let resetBtn = null  // .reset-btn

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
	wrapper = document.querySelector('.envelope-wrapper')
	img = document.querySelector('.envelope-img')
	hint = document.querySelector('.envelope-hint')
	revealCard = document.querySelector('.reveal-card')
	revealEmoji = document.querySelector('.reveal-emoji')
	revealLabel = document.querySelector('.reveal-label')
	revealClaim = document.querySelector('.reveal-claim')
	resetBtn = document.querySelector('.reset-btn')

	if (!wrapper || !img || !revealCard) return

	// Reset: clear state and reload
	if (resetBtn) {
		resetBtn.addEventListener('click', () => {
			localStorage.removeItem(STORAGE_KEY)
			location.reload()
		})
	}

	// Restore previously opened state if it exists
	const stored = loadResult()
	if (stored) {
		restoreOpenedState(stored)
		return
	}

	// Fresh envelope — click starts the sequence
	wrapper.addEventListener('click', onEnvelopeClick)
})

// ===== CLICK =====
// Removes itself immediately — sequence can only fire once.
function onEnvelopeClick() {
	wrapper.removeEventListener('click', onEnvelopeClick)
	const loot = pickLoot()
	runSequence(loot)
}

// ===== STATE MACHINE =====
function runSequence(loot) {
	// Phase 1: SHAKE + GROW — CSS does the work, we just add the class
	hint.classList.add('hidden')
	wrapper.classList.add('shaking')

	// Phase 2: shake ends → rush fires immediately, no pause
	setTimeout(() => {
		startRush()

		// Phase 3: rush ends → reveal fires immediately
		setTimeout(() => {
			showReveal(loot)

			// Phase 4: after card bounce settles → OPENED (persisted)
			setTimeout(() => {
				wrapper.classList.add('opened')
				saveResult(loot)
			}, 500)
		}, RUSH_DURATION)

	}, SHAKE_DURATION)
}

// ===== RUSH =====
// Transitions the envelope from shake end-state (scale 1.4, translate 0)
// to off-screen bottom (scale 0.3, translate 0 150vh).
//
// The handoff problem: shake's forwards fill holds scale:1.4.
// Removing .shaking drops that fill → scale snaps back to 1.
// Solution: set inline styles matching the end values BEFORE removing
// the class. While .shaking is active, the animation overrides them —
// but they're set and ready. The instant the class is removed, the
// inline styles take over at the exact same values. No snap.
// Then double-rAF ensures the browser paints that starting frame
// before we set the transition target.
function startRush() {
	// Lock shake's end values into inline styles
	img.style.translate = '0px 0px'
	img.style.scale = '1.4'

	// Drop shake — inline styles seamlessly take over
	wrapper.classList.remove('shaking')

	// Swap to open-flap image if configured.
	// eleventy's image transform plugin may have wrapped <img> in <picture>
	// with a <source srcset> for webp. Clear it so the browser actually
	// uses our new img.src instead of falling back to the old webp source.
	if (IMG_OPEN !== IMG_CLOSED) {
		const picture = img.parentElement
		if (picture && picture.tagName === 'PICTURE') {
			const source = picture.querySelector('source')
			if (source) source.srcset = ''
		}
		img.src = IMG_OPEN
	}

	// Double rAF: first frame paints the starting state,
	// second frame sets transition + target so the browser animates.
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			// cubic-bezier(0.4, 0, 1, 1): fast initial burst, minimal deceleration
			// — reads as the envelope being yanked away downward
			img.style.transition = `translate ${RUSH_DURATION}ms cubic-bezier(0.4, 0, 1, 1), scale ${RUSH_DURATION}ms cubic-bezier(0.4, 0, 1, 1)`
			img.style.translate = '0px 150vh'
			img.style.scale = '0.3'
		})
	})
}

// ===== REVEAL =====
// Populates the loot card and triggers its bounce-in via .visible.
function showReveal(loot) {
	revealEmoji.textContent = loot.emoji
	revealLabel.textContent = loot.label

	if (loot.url && revealClaim) {
		revealClaim.href = loot.url
		revealClaim.textContent = 'claim →'
		revealClaim.style.display = 'inline'
	} else if (revealClaim) {
		revealClaim.style.display = 'none'
	}

	// .visible triggers the CSS transition (scale 0.3→1 with overshoot bounce)
	revealCard.classList.add('visible')
}

// ===== PERSISTENCE =====
function saveResult(loot) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify({
		opened: true,
		lootId: loot.id,
		openedAt: new Date().toISOString(),
	}))
}

function loadResult() {
	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) return null
	try { return JSON.parse(raw) }
	catch {
		localStorage.removeItem(STORAGE_KEY)
		return null
	}
}

// Restores OPENED state on page load — no animation, just end state.
// If the stored lootId no longer exists in LOOT_POOL, clears storage
// and lets the page act as a fresh envelope.
function restoreOpenedState(stored) {
	const loot = LOOT_POOL.find(item => item.id === stored.lootId)
	if (!loot) {
		localStorage.removeItem(STORAGE_KEY)
		wrapper.addEventListener('click', onEnvelopeClick)
		return
	}

	// Jump to opened: hide envelope, show card immediately
	hint.classList.add('hidden')
	wrapper.classList.add('opened')
	showReveal(loot)
}

// ===== LOOT =====
function pickLoot() {
	return LOOT_POOL[Math.floor(Math.random() * LOOT_POOL.len}
