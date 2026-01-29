/**
 * chaos-hover.js
 * Chaotic hover effect that rapidly cycles through random visual styles
 *
 * Apply .chaos-hover class to any link to enable the effect.
 * On hover: cycles every 50ms between random colors, fonts, transforms, and text-shadows.
 *
 * Intentionally choppy - no transitions, discrete jumps only.
 *
 * Performance optimizations:
 * - Uses requestAnimationFrame instead of setInterval (pauses when tab hidden)
 * - Pre-generates transform pool at startup (100 random transforms)
 * - Caches inner element reference (no querySelector in animation loop)
 * - Uses bitwise OR for fast integer conversion
 *
 * Layout isolation:
 * - CSS uses `contain: layout` to prevent transforms from affecting page scroll
 * - Inner span wrapper receives transforms, outer element stays stable
 */

/* ===== CONFIGURATION POOLS =====
 * Add/remove items from these arrays to customize the chaos
 */

/** Colors to randomly cycle through */
const COLORS = [
	'#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
	'#ff6600', '#ff0066', '#66ff00', '#0066ff', '#6600ff', '#00ff66',
	'#ffffff', '#000000', '#ff3333', '#33ff33', '#3333ff'
]

/** Font families to randomly apply */
const FONTS = [
	'"Karrik", sans-serif',      // Site's main font
	'"FT88", monospace',         // Site's display font
	'Comic Sans MS, cursive',    // Chaos classic
	'Impact, sans-serif',
	'Papyrus, fantasy',
	'Courier New, monospace',
	'Times New Roman, serif',
	'Arial Black, sans-serif',
	'Georgia, serif'
]

/** Pre-generated transform pool
 * Built at startup to avoid string creation during animation
 * 100 random transforms should be enough variety
 */
const TRANSFORM_POOL = []
const TRANSFORM_POOL_SIZE = 100

/**
 * Image paths for random image swaps
 * Add your images here - they'll randomly replace link text
 *
 * Example:
 *   '/assets/img/chaos/glitch1.png',
 *   '/assets/img/chaos/eye.gif',
 */
const IMAGES = [
	// TODO: Add image paths here
	// '/assets/img/chaos/example.png',
]

/** How often to change styles (ms) - lower = more chaotic */
const CYCLE_SPEED = 75

/** Chance of showing an image instead of styled text (0-1) */
const IMAGE_CHANCE = 0.15

/* ===== STATE TRACKING ===== */

/** Map of element -> animation state for cleanup */
const activeAnimations = new Map()

/** Map of element -> original state for restoration */
const originalStates = new Map()

/* ===== UTILITY FUNCTIONS ===== */

/**
 * Pick a random item from an array using cached length
 * @param {Array} arr - Array to pick from
 * @returns {*} Random item from the array
 */
function pickRandom(arr) {
	return arr[(Math.random() * arr.length) | 0]
}

/**
 * Build the transform pool at startup
 * Pre-generates random transform strings to avoid allocation during animation
 */
function buildTransformPool() {
	const transformTypes = [
		() => `rotate(${((Math.random() * 360) - 180) | 0}deg)`,
		() => `skewX(${((Math.random() * 360) - 180) | 0}deg)`,
		() => `skewY(${((Math.random() * 360) - 180) | 0}deg)`,
		() => `scale(${(Math.random() * 1.7 + 0.3).toFixed(2)})`,
		() => `translateX(${((Math.random() * 60) - 30) | 0}px)`,
		() => `translateY(${((Math.random() * 60) - 30) | 0}px)`
	]

	for (let i = 0; i < TRANSFORM_POOL_SIZE; i++) {
		const numTransforms = ((Math.random() * 3) | 0) + 1
		const parts = []
		for (let j = 0; j < numTransforms; j++) {
			parts.push(pickRandom(transformTypes)())
		}
		TRANSFORM_POOL.push(parts.join(' '))
	}
}

/**
 * Get a random pre-built transform from the pool
 * @returns {string} CSS transform value
 */
function getRandomTransform() {
	return TRANSFORM_POOL[(Math.random() * TRANSFORM_POOL_SIZE) | 0]
}

/**
 * Generate random text-shadow value
 * @returns {string} CSS text-shadow value or 'none'
 */
function getRandomTextShadow() {
	if (Math.random() > 0.5) {
		const x = ((Math.random() * 6) - 3) | 0
		const y = ((Math.random() * 6) - 3) | 0
		return `${x}px ${y}px 0 ${pickRandom(COLORS)}`
	}
	return 'none'
}

/**
 * Create an image element for swapping
 * @param {string} src - Image source path
 * @returns {HTMLImageElement} Configured image element
 */
function createChaosImage(src) {
	const img = document.createElement('img')
	img.src = src
	img.alt = ''
	img.className = 'chaos-hover-image'
	img.style.height = '1.2em'
	img.style.width = 'auto'
	img.style.verticalAlign = 'middle'
	return img
}

/* ===== CORE EFFECT FUNCTIONS ===== */

/**
 * Apply a random chaotic style to an element
 * Uses cached inner element reference for performance
 * @param {HTMLElement} inner - The inner span element (cached)
 * @param {Object} state - Original state object
 */
function applyChaosStyle(inner, state) {
	// Decide: image or styled text?
	const showImage = IMAGES.length > 0 && Math.random() < IMAGE_CHANCE

	if (showImage) {
		// Swap to random image
		const img = createChaosImage(pickRandom(IMAGES))
		inner.innerHTML = ''
		inner.appendChild(img)
		inner.style.color = ''
	} else {
		// Restore text if it was an image
		if (inner.firstChild?.className === 'chaos-hover-image') {
			inner.innerHTML = state.html
		}

		// Apply random text styles to the inner span
		inner.style.color = pickRandom(COLORS)
		inner.style.fontFamily = pickRandom(FONTS)
		inner.style.textShadow = getRandomTextShadow()
	}

	// Apply random transform from pre-built pool
	inner.style.transform = getRandomTransform()
}

/**
 * Start the chaos effect on an element
 * Uses requestAnimationFrame for better performance (pauses when tab not visible)
 * @param {HTMLElement} el - Element to chaos-ify
 */
function startChaos(el) {
	// Don't restart if already running - prevents overwriting original state
	if (activeAnimations.has(el)) return

	// Store original state for restoration
	const state = {
		html: el.innerHTML,
		color: el.style.color,
		fontFamily: el.style.fontFamily,
		textShadow: el.style.textShadow,
		transition: el.style.transition,
		width: el.style.width,
		height: el.style.height
	}
	originalStates.set(el, state)

	// Lock dimensions BEFORE any style changes
	const rect = el.getBoundingClientRect()
	el.style.width = rect.width + 'px'
	el.style.height = rect.height + 'px'

	// Wrap content in an inner span for transforms
	const inner = document.createElement('span')
	inner.className = 'chaos-hover-inner'
	inner.innerHTML = el.innerHTML
	inner.style.display = 'inline-block'
	el.innerHTML = ''
	el.appendChild(inner)

	// Kill any transitions for maximum choppiness
	el.style.transition = 'none'

	// Animation state - cache inner element and track timing
	let lastTime = 0
	let rafId = 0

	function animate(currentTime) {
		// Throttle to CYCLE_SPEED ms between updates
		if (currentTime - lastTime >= CYCLE_SPEED) {
			applyChaosStyle(inner, state)
			lastTime = currentTime
		}
		rafId = requestAnimationFrame(animate)
	}

	// Start animation
	rafId = requestAnimationFrame(animate)
	activeAnimations.set(el, () => cancelAnimationFrame(rafId))

	// Apply first chaos immediately
	applyChaosStyle(inner, state)
}

/**
 * Stop the chaos effect and restore original state
 * @param {HTMLElement} el - Element to restore
 */
function stopChaos(el) {
	// Cancel the animation frame
	const cancelFn = activeAnimations.get(el)
	if (cancelFn) {
		cancelFn()
		activeAnimations.delete(el)
	}

	// Restore original state
	const state = originalStates.get(el)
	if (state) {
		// Restore original HTML (removes inner span wrapper)
		el.innerHTML = state.html
		// Restore outer element styles we modified
		el.style.color = state.color
		el.style.fontFamily = state.fontFamily
		el.style.textShadow = state.textShadow
		el.style.transition = state.transition
		// Unlock dimensions
		el.style.width = state.width
		el.style.height = state.height
		originalStates.delete(el)
	}
}

/* ===== INITIALIZATION ===== */

/**
 * Initialize chaos hover effect on all .chaos-hover elements
 * Call this after DOM is ready
 */
export function initChaosHover() {
	// Build transform pool once at startup (avoids allocation during animation)
	if (TRANSFORM_POOL.length === 0) {
		buildTransformPool()
	}

	const chaosLinks = document.querySelectorAll('.chaos-hover')

	chaosLinks.forEach(link => {
		link.addEventListener('mouseenter', () => startChaos(link))
		link.addEventListener('mouseleave', () => stopChaos(link))

		// Stop chaos on click (before navigation happens)
		link.addEventListener('click', () => stopChaos(link))

		// Also handle focus for keyboard nav accessibility
		link.addEventListener('focus', () => startChaos(link))
		link.addEventListener('blur', () => stopChaos(link))
	})

	// Log how many elements are chaos-enabled (dev convenience)
	if (chaosLinks.length > 0) {
		console.log(`[chaos-hover] Initialized on ${chaosLinks.length} element(s)`)
	}
}

/**
 * Add images to the chaos pool at runtime
 * @param {string[]} imagePaths - Array of image paths to add
 */
export function addChaosImages(imagePaths) {
	IMAGES.push(...imagePaths)
}

/**
 * Clear all images from the chaos pool
 */
export function clearChaosImages() {
	IMAGES.length = 0
}
