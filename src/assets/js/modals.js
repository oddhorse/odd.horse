/**
 * modals.js
 * Handles modal open/close functionality and logo hover integration
 *
 * Modals are triggered by footer buttons and can be closed via:
 * - Close button click
 * - Clicking outside modal container
 * - Escape key press
 *
 * Links inside modals trigger the same logo color change effect as footer links
 * (integrated with navbar.js logo hover system)
 */

/**
 * Open a modal by ID
 * @param {string} modalId - ID of the modal content to show (e.g., 'modal-contact')
 */
export function openModal(modalId) {
	const overlay = document.getElementById('modal-overlay')
	const modalContent = document.getElementById(modalId)

	if (!overlay || !modalContent) return

	// Hide all modal content sections
	document.querySelectorAll('.modal-content').forEach((content) => {
		content.classList.remove('active')
	})

	// Show the requested modal content
	modalContent.classList.add('active')

	// Show overlay and prevent body scroll
	document.body.classList.add('modal-open')

	// Set ARIA attributes for accessibility
	overlay.setAttribute('aria-hidden', 'false')

	// Focus on close button for keyboard accessibility
	const closeButton = overlay.querySelector('.modal-close')
	if (closeButton) {
		closeButton.focus()
	}
}

/**
 * Close the currently open modal
 */
export function closeModal() {
	const overlay = document.getElementById('modal-overlay')
	if (!overlay) return

	// Hide overlay and restore body scroll
	document.body.classList.remove('modal-open')

	// Set ARIA attributes for accessibility
	overlay.setAttribute('aria-hidden', 'true')

	// Hide all modal content after transition completes
	setTimeout(() => {
		document.querySelectorAll('.modal-content').forEach((content) => {
			content.classList.remove('active')
		})
	}, 200) // Match CSS transition duration
}

/**
 * Set up modal system event handlers
 * Called from main.js on DOMContentLoaded
 */
export function setupModals() {
	const overlay = document.getElementById('modal-overlay')
	const closeButton = document.querySelector('.modal-close')

	if (!overlay) return

	// Close button click
	if (closeButton) {
		closeButton.addEventListener('click', closeModal)
	}

	// Click outside modal container to close
	overlay.addEventListener('click', (e) => {
		// Only close if clicking the overlay itself, not the modal container
		if (e.target === overlay) {
			closeModal()
		}
	})

	// Escape key to close
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
			closeModal()
		}
	})

	// Set up modal trigger buttons (from footer)
	// Use generic selector to work anywhere on page
	const modalTriggers = document.querySelectorAll('[data-modal-trigger]')

	modalTriggers.forEach((trigger) => {
		const modalId = trigger.getAttribute('data-modal-trigger')

		trigger.addEventListener('click', (e) => {
			e.preventDefault()
			// Convert trigger ID to full modal ID (e.g., 'stream' → 'modal-stream')
			openModal(`modal-${modalId}`)
		})
	})
}

/**
 * Set up logo color change for modal links, footer icons, and footer buttons
 * This integrates with the existing navbar.js logo hover system
 * Called from navbar.js setupNavbar() function
 *
 * @param {HTMLElement} logoContainer - The logo container element
 */
export function setupModalLinkHovers(logoContainer) {
	if (!logoContainer) return

	// Handle all links inside modals with .modal-link class
	const modalLinks = document.querySelectorAll('.modal-link')

	for (const link of modalLinks) {
		// Get the custom color for this specific link
		const linkColor = getComputedStyle(link)
			.getPropertyValue('--modal-link-color')
			.trim()

		// Create semi-transparent shadow color (33 = 20% opacity in hex)
		const shadowColor = `${linkColor}33`

		// On hover, change logo to match link color
		link.addEventListener('mouseenter', () => {
			logoContainer.style.setProperty('--logo-color', linkColor)
			logoContainer.style.setProperty('--logo-shadow-color', shadowColor)
		})

		// On mouse leave, reset to default (page color)
		link.addEventListener('mouseleave', () => {
			logoContainer.style.setProperty('--logo-color', '')
			logoContainer.style.setProperty('--logo-shadow-color', '')
		})
	}

	// Handle footer social icons
	const footerIcons = document.querySelectorAll('.footer-social-icon')

	for (const icon of footerIcons) {
		// Get the custom color for this specific icon
		const iconColor = getComputedStyle(icon)
			.getPropertyValue('--footer-icon-color')
			.trim()

		// Create semi-transparent shadow color
		const shadowColor = `${iconColor}33`

		// On hover, change logo to match icon color
		icon.addEventListener('mouseenter', () => {
			logoContainer.style.setProperty('--logo-color', iconColor)
			logoContainer.style.setProperty('--logo-shadow-color', shadowColor)
		})

		// On mouse leave, reset to default
		icon.addEventListener('mouseleave', () => {
			logoContainer.style.setProperty('--logo-color', '')
			logoContainer.style.setProperty('--logo-shadow-color', '')
		})
	}

	// Handle footer modal buttons
	const footerButtons = document.querySelectorAll('.footer-button')

	for (const button of footerButtons) {
		// Get the custom color for this specific button
		const buttonColor = getComputedStyle(button)
			.getPropertyValue('--footer-button-color')
			.trim()

		// Create semi-transparent shadow color
		const shadowColor = `${buttonColor}33`

		// On hover, change logo to match button color
		button.addEventListener('mouseenter', () => {
			logoContainer.style.setProperty('--logo-color', buttonColor)
			logoContainer.style.setProperty('--logo-shadow-color', shadowColor)
		})

		// On mouse leave, reset to default
		button.addEventListener('mouseleave', () => {
			logoContainer.style.setProperty('--logo-color', '')
			logoContainer.style.setProperty('--logo-shadow-color', '')
		})
	}
}
