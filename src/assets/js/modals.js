/**
 * modals.js
 * Handles modal open/close functionality and logo hover integration
 *
 * Modals are triggered by footer buttons and can be closed via:
 * - Close button click
 * - Clicking outside modal container
 * - Escape key press
 *
 * Logo colour tinting for links inside modals is handled generically by
 * logo-hover.js, which picks them up via their --hover-color variable.
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
 * Called from core.js on DOMContentLoaded
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
