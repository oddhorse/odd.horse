/**
 * navbar.js
 * Handles hover effects that change the logo color
 *
 * Artifact links have --artifact-color. When hovering over any link,
 * the logo's --logo-color variable is updated to match that link's color.
 * The logo SVG uses fill="currentColor" to inherit this color dynamically.
 *
 * This creates the signature odd.horse effect where the logo changes color
 * as you hover over different links throughout the site.
 *
 * Also integrates with modals.js to set up footer and modal link hover effects.
 */

import { setupModalLinkHovers } from './modals.js'

/**
 * Set up hover effects for artifact links and integrate modal/footer link hovers
 * Attaches mouseenter/mouseleave handlers to change logo color on hover
 */
export function setupNavbar() {
	const logoContainer = document.querySelector('.logo-container')
	if (!logoContainer) return

	// Handle artifact links (use --artifact-color)
	const artifactLinks = document.querySelectorAll('.artifact-link')
	for (const link of artifactLinks) {
		// Get the color defined for this specific artifact
		const artifactColor = getComputedStyle(link)
			.getPropertyValue('--artifact-color')
			.trim()

		// Create semi-transparent shadow color
		const shadowColor = `${artifactColor}33`

		// On hover, change logo to match artifact color
		link.addEventListener('mouseenter', () => {
			logoContainer.style.setProperty('--logo-color', artifactColor)
			logoContainer.style.setProperty('--logo-shadow-color', shadowColor)
		})

		// On mouse leave, reset to default (page color)
		link.addEventListener('mouseleave', () => {
			logoContainer.style.setProperty('--logo-color', '') // Reset to default
			logoContainer.style.setProperty('--logo-shadow-color', '')
		})
	}

	// Handle artifact badges (use --artifact-color from parent link)
	const artifactBadges = document.querySelectorAll('.artifact-badge')
	for (const badge of artifactBadges) {
		// Get the artifact link that's a sibling of this badge
		const link = badge.parentElement.querySelector('.artifact-link')
		if (link) {
			const artifactColor = getComputedStyle(link)
				.getPropertyValue('--artifact-color')
				.trim()
			const shadowColor = `${artifactColor}33`

			badge.addEventListener('mouseenter', () => {
				logoContainer.style.setProperty('--logo-color', artifactColor)
				logoContainer.style.setProperty('--logo-shadow-color', shadowColor)
			})
			badge.addEventListener('mouseleave', () => {
				logoContainer.style.setProperty('--logo-color', '')
				logoContainer.style.setProperty('--logo-shadow-color', '')
			})
		}
	}

	// Handle modal links (use --modal-link-color)
	// This ensures links inside contact/links modals trigger logo color change
	setupModalLinkHovers(logoContainer)
}
