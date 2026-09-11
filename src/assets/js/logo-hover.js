/**
 * logo-hover.js
 * The signature odd.horse effect: hovering any colored link tints the logo.
 *
 * Every hoverable element declares its own colour once, as a --hover-color
 * inline style. CSS uses that same variable to colour the element itself, and
 * this module reads it to tint the logo — so a new hoverable type only needs
 * the variable and an entry in HOVER_SELECTOR below.
 *
 * Uses one delegated listener on document rather than per-element listeners,
 * which means elements added after page load (the beta menu's dummy artifacts)
 * work automatically, with no re-binding.
 */

/** Elements that tint the logo on hover. Add new hoverable types here. */
const HOVER_SELECTOR =
	'.artifact-link, .modal-link, .footer-social-icon, .footer-button'

/**
 * Wire up logo tinting for the whole page.
 * Safe to call on pages with no logo — it simply does nothing.
 */
export function setupLogoHover() {
	// Every logo on the page tints, not just the first — the logo is a
	// drop-in component and a page may hold more than one.
	const logos = document.querySelectorAll('.logo-container')
	if (logos.length === 0) return

	/**
	 * Tint the logo to match a hovered element's colour.
	 * @param {string} color - Hex colour from the element's --hover-color
	 */
	const tintLogo = (color) => {
		for (const logo of logos) {
			logo.style.setProperty('--logo-color', color)
			// 33 = 20% alpha. Assumes 6-digit hex, which is what every colour
			// in links.json and artifacts.json uses.
			logo.style.setProperty('--logo-shadow-color', `${color}33`)
		}
	}

	/** Drop back to the page's default logo colour. */
	const resetLogo = () => {
		for (const logo of logos) {
			logo.style.setProperty('--logo-color', '')
			logo.style.setProperty('--logo-shadow-color', '')
		}
	}

	// mouseover/mouseout (not mouseenter/leave) because only these bubble,
	// which is what makes a single delegated listener possible.
	document.addEventListener('mouseover', (event) => {
		const hovered = event.target.closest(HOVER_SELECTOR)
		if (!hovered) return

		const color = getComputedStyle(hovered)
			.getPropertyValue('--hover-color')
			.trim()
		if (color) tintLogo(color)
	})

	document.addEventListener('mouseout', (event) => {
		const left = event.target.closest(HOVER_SELECTOR)
		if (!left) return

		// These elements wrap inner spans, so moving between children fires
		// mouseout. Only reset when the cursor truly leaves the element.
		if (left.contains(event.relatedTarget)) return

		resetLogo()
	})
}
