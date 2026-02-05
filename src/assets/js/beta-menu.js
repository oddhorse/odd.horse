/* beta-menu.js
 * Development-only UI helpers for the beta branch.
 * Extracted from src/_includes/beta-menu.njk and loaded only when
 * the template is rendered (i.e., not present on `main` branch builds).
 */

// Wait for DOM to be ready before querying elements
document.addEventListener('DOMContentLoaded', () => {
	// FPS counter - updates every 500ms
	const fpsCounter = document.getElementById('fps-counter')
	if (fpsCounter) {
		setInterval(() => {
			if (window.backgroundStats) {
				fpsCounter.textContent = `fps: ${window.backgroundStats.fps}`
			} else {
				fpsCounter.textContent = 'fps: --'
			}
		}, 500)
	}

	// Background control buttons
	const bgDiagonal = document.getElementById('bg-diagonal')
	const bgHorizontal = document.getElementById('bg-horizontal')
	const bgVertical = document.getElementById('bg-vertical')
	const bgRotate = document.getElementById('bg-rotate')
	const bgPause = document.getElementById('bg-pause')

	if (bgDiagonal) {
		bgDiagonal.addEventListener('click', () => {
			if (window.backgroundControls) {
				window.backgroundControls.setDirection('diagonal')
				console.log('Background: diagonal scroll')
			}
		})
	}

	if (bgHorizontal) {
		bgHorizontal.addEventListener('click', () => {
			if (window.backgroundControls) {
				window.backgroundControls.setDirection('horizontal')
				console.log('Background: horizontal scroll')
			}
		})
	}

	if (bgVertical) {
		bgVertical.addEventListener('click', () => {
			if (window.backgroundControls) {
				window.backgroundControls.setDirection('vertical')
				console.log('Background: vertical scroll')
			}
		})
	}

	if (bgRotate) {
		bgRotate.addEventListener('click', () => {
			if (window.backgroundControls) {
				window.backgroundControls.setDirection('rotate')
				console.log('Background: rotate')
			}
		})
	}

	if (bgPause) {
		bgPause.addEventListener('click', () => {
			if (window.backgroundControls) {
				const paused = window.backgroundControls.togglePause()
				console.log(`Background: ${paused ? 'paused' : 'resumed'}`)
			}
		})
	}

	// Toggle beta menu open/closed
	const toggle = document.querySelector('.beta-menu-toggle')
	const menu = document.querySelector('.beta-menu')

	if (toggle && menu) {
		toggle.addEventListener('click', () => {
			menu.classList.toggle('open')
		})
	}

	// Close menu when clicking outside
	document.addEventListener('click', (e) => {
		if (!menu || !menu.contains(e.target)) return
		if (!menu.contains(e.target)) menu.classList.remove('open')
	})

	// Clear click data button
	const clearButton = document.getElementById('clear-clicks')
	if (clearButton) {
		clearButton.addEventListener('click', () => {
			if (window.wipeClickData && window.refreshArtifactUI) {
				window.wipeClickData()
				// Refresh UI without reloading page
				window.refreshArtifactUI()
				console.log('Click data cleared and UI refreshed')
			} else {
				console.error('Artifact functions not available')
			}
		})
	}

	// Add dummy artifact button
	const addDummyButton = document.getElementById('add-dummy-artifact')
	let dummyCounter = 1
	if (addDummyButton) {
		addDummyButton.addEventListener('click', () => {
			const artifactList = document.querySelector('.artifact-list')
			if (!artifactList) {
				console.error('Artifact list not found')
				return
			}

			// Generate random color
			const randomColor = '#' + Math
				.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, '0')

			// Create dummy artifact element
			const dummyId = `dummy-artifact-${dummyCounter}`
			const dummyDate = new Date().toISOString().split('T')[0]

			const li = document.createElement('li')
			li.className = 'artifact-item unclicked new'
			li.dataset.artifactId = dummyId
			li.dataset.dateAdded = dummyDate

			li.innerHTML = `
                <span class="artifact-badge artifact-badge-clicked">SEEN</span>
                <span class="artifact-badge artifact-badge-new">NEW!</span>
                <a href="#" class="artifact-link" style="--artifact-color: ${randomColor};">
                    <span class="artifact-status"></span>
                    <span class="artifact-description">test artifact ${dummyCounter}</span>
                    <span class="artifact-date">${dummyDate}</span>
                </a>
            `

			// Insert at the top of the list (newest first)
			artifactList.insertBefore(li, artifactList.firstChild)

			// Re-initialize tracking for the new artifact
			const link = li.querySelector('.artifact-link')
			if (link && window.initArtifactTracking) {
				link.addEventListener('click', (e) => {
					e.preventDefault() // Don't navigate for dummy links
					// Mark as clicked manually
					li.classList.remove('unclicked')
					li.classList.add('clicked')
				})
			}

			// Set up logo hover for new link
			const logoContainer = document.querySelector('.logo-container')
			if (logoContainer && link) {
				const artifactColor = randomColor
				const shadowColor = `${artifactColor}33`

				link.addEventListener('mouseenter', () => {
					logoContainer.style.setProperty('--logo-color', artifactColor)
					logoContainer.style.setProperty('--logo-shadow-color', shadowColor)
				})
				link.addEventListener('mouseleave', () => {
					logoContainer.style.setProperty('--logo-color', '')
					logoContainer.style.setProperty('--logo-shadow-color', '')
				})
			}

			dummyCounter++
			console.log(`Added dummy artifact ${dummyCounter - 1}`)
		})
	}
})
