/**
 * colors.js
 * Dynamic color system that derives all interactive colors from a base page color
 *
 * Each page can define a --page-color CSS variable (typically set inline in the template).
 * This module converts that base color to HSL and derives hover states, backgrounds,
 * and accents by adjusting lightness. This ensures visual consistency across the site
 * while allowing each page to have its own color identity.
 */

/**
 * Convert hex color to HSL object
 * @param {string} hex - Hex color string (e.g., "#ff00bb")
 * @returns {{h: number, s: string, l: string}} HSL object with hue (0-360), saturation (%), lightness (%)
 */
function hexToHSL(hex) {
	// Convert HEX to RGB values (0-1 range)
	const r = Number.parseInt(hex.slice(1, 3), 16) / 255
	const g = Number.parseInt(hex.slice(3, 5), 16) / 255
	const b = Number.parseInt(hex.slice(5, 7), 16) / 255

	// Find min and max RGB values to calculate lightness and saturation
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h
	let s
	const l = (max + min) / 2

	if (max === min) {
		// Achromatic (gray) - no hue or saturation
		h = s = 0
	} else {
		const d = max - min
		// Saturation depends on lightness
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		// Calculate hue based on which RGB component is dominant
		h =
			60 *
			(r === max
				? (g - b) / d + (g < b ? 6 : 0)
				: g === max
					? (b - r) / d + 2
					: (r - g) / d + 4)
	}

	return {
		h: Math.round(h),
		s: `${Math.round(s * 100)}%`,
		l: `${Math.round(l * 100)}%`,
	}
}

/**
 * Darken a color by reducing lightness
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to darken (default 10)
 * @returns {string} HSL color string
 */
function darkenColor(hex, percent = 10) {
	const hsl = hexToHSL(hex)
	// Reduce lightness, ensuring it doesn't go below 0
	const newLightness = Math.max(0, Number.parseInt(hsl.l) - percent)
	return `hsl(${hsl.h}, ${hsl.s}, ${newLightness}%)`
}

/**
 * Lighten a color by increasing lightness
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to lighten (default 10)
 * @returns {string} HSL color string
 */
function lightenColor(hex, percent = 10) {
	const hsl = hexToHSL(hex)
	// Increase lightness, ensuring it doesn't exceed 100
	const newLightness = Math.min(100, Number.parseInt(hsl.l) + percent)
	return `hsl(${hsl.h}, ${hsl.s}, ${newLightness}%)`
}

/**
 * Define all derived colors based on the page's base color
 * Sets CSS variables for links, buttons, and backgrounds
 *
 * @param {string} [color] - Optional hex color to use as base (overrides --page-color)
 */
export function defineColors(color) {
	const doc = document.documentElement
	let pageColor

	if (color) {
		// Explicitly set page color (used for programmatic color changes)
		doc.style.setProperty('--page-color', color)
		pageColor = color
	} else {
		// Use the page color already defined in CSS
		pageColor = getComputedStyle(doc).getPropertyValue('--page-color')
	}

	// Derive all interactive colors from the base page color
	doc.style.setProperty('--link-color', pageColor)
	doc.style.setProperty('--link-hover-color', darkenColor(pageColor))
	doc.style.setProperty('--button-background-color', pageColor)
	doc.style.setProperty('--accent-background', lightenColor(pageColor))
	doc.style.setProperty('--hover-background', darkenColor(pageColor, 20))
}
