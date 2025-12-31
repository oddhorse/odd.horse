// localStorage key for tracking clicks
const STORAGE_KEY = 'oddhorse-artifact-clicks'

// Load click data from localStorage
export function loadClickData() {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : {}
	} catch (e) {
		console.error('Failed to load click data:', e)
		return {}
	}
}

// Save click data to localStorage
function saveClickData(data) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch (e) {
		console.error('Failed to save click data:', e)
	}
}

// Mark artifact as clicked
export function markClicked(artifactId) {
	const data = loadClickData()

	if (!data[artifactId]) {
		data[artifactId] = {
			clicked: true,
			firstClickDate: new Date().toISOString(),
			clickCount: 1,
		}
	} else {
		data[artifactId].clickCount++
	}

	saveClickData(data)
}

// Check if artifact has been clicked
export function isClicked(artifactId) {
	const data = loadClickData()
	return data[artifactId]?.clicked || false
}

// Check if artifact is new (within 30 days)
export function isNew(dateAdded) {
	const added = new Date(dateAdded)
	const now = new Date()
	const diffDays = (now - added) / (1000 * 60 * 60 * 24)
	return diffDays <= 30
}

// Initialize artifact tracking
export function initArtifactTracking() {
	const clickData = loadClickData()

	// Update UI for each artifact
	document.querySelectorAll('.artifact-item').forEach((item) => {
		const artifactId = item.dataset.artifactId
		const dateAdded = item.dataset.dateAdded

		// Add clicked/unclicked class
		if (isClicked(artifactId)) {
			item.classList.add('clicked')
		} else {
			item.classList.add('unclicked')
		}

		// Add new class if within 30 days
		if (isNew(dateAdded)) {
			item.classList.add('new')
		}

		// Attach click handler to link
		const link = item.querySelector('.artifact-link')
		if (link) {
			link.addEventListener('click', () => {
				markClicked(artifactId)
				item.classList.remove('unclicked')
				item.classList.add('clicked')
			})
		}
	})
}
