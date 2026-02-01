/**
 * artifacts.js
 * Click tracking system for artifact links using localStorage
 *
 * Tracks which artifacts users have clicked and visually marks them with
 * filled dots. Also marks recently added artifacts (within 30 days) as "new".
 * Click data persists across sessions via localStorage, allowing users to
 * see which artifacts they've already explored.
 *
 * Storage format:
 * {
 *   "artifact-id": {
 *     clicked: true,
 *     firstClickDate: "2025-12-31T12:00:00.000Z",
 *     clickCount: 3
 *   }
 * }
 */

// localStorage key for tracking clicks
const STORAGE_KEY = 'oddhorse-artifact-clicks'

/**
 * Load click tracking data from localStorage
 * @returns {Object} Click data object mapping artifact IDs to click info
 */
export function loadClickData() {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : {}
	} catch (e) {
		console.error('Failed to load click data:', e)
		return {}
	}
}

/**
 * Delete click data and visually reset the elements
 */
export function wipeClickData() {
	try {
		localStorage.removeItem(STORAGE_KEY)
		console.log("wiped storage data!")
	} catch (e) {
		console.error('Failed to wipe click data:', e)
	}
}

/**
 * Save click tracking data to localStorage
 * @param {Object} data - Click data object to save
 */
function saveClickData(data) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch (e) {
		console.error('Failed to save click data:', e)
	}
}

/**
 * Mark an artifact as clicked
 * Creates new entry on first click, increments count on subsequent clicks
 *
 * @param {string} artifactId - Unique identifier for the artifact
 */
export function markClicked(artifactId) {
	const data = loadClickData()

	if (!data[artifactId]) {
		// First click - create new entry
		data[artifactId] = {
			clicked: true,
			firstClickDate: new Date().toISOString(),
			clickCount: 1,
		}
	} else {
		// Subsequent click - increment counter
		data[artifactId].clickCount++
	}

	saveClickData(data)
}

/**
 * Check if an artifact has been clicked before
 * @param {string} artifactId - Unique identifier for the artifact
 * @returns {boolean} True if artifact has been clicked
 */
export function isClicked(artifactId) {
	const data = loadClickData()
	return data[artifactId]?.clicked || false
}

/**
 * Check if an artifact is new (added within 30 days)
 * @param {string} dateAdded - ISO date string when artifact was added
 * @returns {boolean} True if artifact was added within 30 days
 */
export function isNew(dateAdded) {
	const added = new Date(dateAdded)
	const now = new Date()
	const diffDays = (now - added) / (1000 * 60 * 60 * 24)
	return diffDays <= 30
}

/**
 * Refresh artifact UI based on current localStorage state
 * Updates classes without re-adding event listeners
 * Call this after wipeClickData() to update the UI
 */
export function refreshArtifactUI() {
	document.querySelectorAll('.artifact-item').forEach((item) => {
		const artifactId = item.dataset.artifactId
		const dateAdded = item.dataset.dateAdded

		// Update clicked/unclicked state based on current data
		if (isClicked(artifactId)) {
			item.classList.remove('unclicked')
			item.classList.add('clicked')
		} else {
			item.classList.remove('clicked')
			item.classList.add('unclicked')
		}

		// Update new state
		if (isNew(dateAdded)) {
			item.classList.add('new')
		} else {
			item.classList.remove('new')
		}
	})
}

/**
 * Initialize artifact click tracking
 * Restores clicked/unclicked state from localStorage, marks new artifacts,
 * and attaches click handlers to all artifact links
 */
export function initArtifactTracking() {
	const clickData = loadClickData()

	// Update UI for each artifact on the page
	document.querySelectorAll('.artifact-item').forEach((item) => {
		const artifactId = item.dataset.artifactId
		const dateAdded = item.dataset.dateAdded

		// Add visual state class based on click history
		if (isClicked(artifactId)) {
			item.classList.add('clicked')
		} else {
			item.classList.add('unclicked')
		}

		// Mark recently added artifacts
		if (isNew(dateAdded)) {
			item.classList.add('new')
		}

		// Attach click handler to track interactions
		const link = item.querySelector('.artifact-link')
		if (link) {
			link.addEventListener('click', () => {
				markClicked(artifactId)
				// Update visual state immediately
				item.classList.remove('unclicked')
				item.classList.add('clicked')
			})
		}

		// Make badges clickable - clicking badge triggers the link
		const badges = item.querySelectorAll('.artifact-badge')
		badges.forEach((badge) => {
			badge.addEventListener('click', (e) => {
				e.preventDefault()
				e.stopPropagation()
				// Trigger the link click
				if (link) {
					link.click()
				}
			})
		})
	})
}
