/**
 * Tagline rotation system (extracted from header-logo.njk)
 *
 * - Cycles through random taglines with bounce animation
 * - Auto-rotates every 10 seconds
 * - Click tagline to cycle manually and reset timer
 * - Isolated in an IIFE to avoid global scope pollution
 *
 * Implementation notes:
 * - `taglines` are passed via a `data-taglines` attribute on the
 *   `#tagline` element (serialized JSON by Nunjucks).
 * - The module also splits the text logo (`.text-logo`) into
 *   per-letter spans with class `header-logo-piece` for individual
 *   interactions/styles.
 * - This file is safe to load as an ES module (`type="module"`) or
 *   as a plain script; it only runs when the DOM is ready.
 */

(() => {
	// ===== CONSTANTS =====
	const ROTATION_INTERVAL_MS = 10000

	// ===== STATE =====
	const taglineElement = document.getElementById('tagline')

	// Read taglines from data attribute set on the element by Nunjucks
	let taglines = []
	try {
		const raw = taglineElement && taglineElement.getAttribute('data-taglines')
		if (raw) taglines = JSON.parse(raw)
	} catch (err) {
		console.error('Failed to parse taglines for header-logo:', err)
		taglines = []
	}

	if (!taglineElement || !Array.isArray(taglines) || taglines.length === 0) return

	// Randomize the tagline order once on load
	const shuffledTaglines = [...taglines].sort(() => Math.random() - 0.5)

	// Mutable state
	let currentIndex = 0
	let rotationTimer = null

	// ===== HELPER FUNCTIONS =====
	/** Return the next tagline (wraps to start) */
	function getNextTagline() {
		currentIndex = (currentIndex + 1) % shuffledTaglines.length
		return shuffledTaglines[currentIndex]
	}

	/** Add and later remove the bounce animation class */
	function bounceElement(elToBounce) {
		elToBounce.classList.add('hoverwink-animate')
		const animationDuration = parseFloat(getComputedStyle(elToBounce).getPropertyValue('--hoverwink-transition-speed')) * 1000
		setTimeout(() => elToBounce.classList.remove('hoverwink-animate'), animationDuration)
	}

	/** Swap in next tagline and animate it */
	function rotateTagline() {
		taglineElement.innerHTML = getNextTagline()
		bounceElement(taglineElement)
	}

	/** Start or restart the automatic rotation interval */
	function startRotationTimer() {
		if (rotationTimer) clearInterval(rotationTimer)
		rotationTimer = setInterval(rotateTagline, ROTATION_INTERVAL_MS)
	}

	// ===== EVENT HANDLERS =====
	/** Attach click handlers for tagline and logo pieces */
	function setupClickHandlers() {
		// Click tagline to immediately rotate and reset timer
		taglineElement.addEventListener('click', () => {
			rotateTagline()
			startRotationTimer()
		})

		// Clicking any letter piece triggers a bounce for fun
		const headerLogoPieces = document.getElementsByClassName('header-logo-piece')
		for (const piece of headerLogoPieces) {
			piece.addEventListener('click', () => bounceElement(piece))
		}
	}

	// ===== INITIALIZATION HELPERS =====
	/** Split the textual logo into per-letter spans for styling/interaction */
	function initializeTextLogo() {
		const textLogo = document.querySelector('.text-logo')
		if (!textLogo) return

		const text = textLogo.getAttribute('data-text') || 'oddhorse'
		const letterSpans = text
			.split('')
			.map((letter) => `<span class="header-logo-piece letter-${letter} hoverwink">${letter}</span>`)
			.join('')
		textLogo.innerHTML = letterSpans
	}

	// ===== BOOTSTRAP =====
	/** Initialize logo and start rotation once DOM is ready */
	function init() {
		initializeTextLogo()
		taglineElement.innerHTML = shuffledTaglines[currentIndex]
		taglineElement.style.opacity = 1
		bounceElement(taglineElement)
		startRotationTimer()
		setupClickHandlers()
	}

	document.addEventListener('DOMContentLoaded', init)
})()
