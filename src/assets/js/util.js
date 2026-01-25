/**
 * util.js
 * NOTE: This file appears unused in the current codebase. Keep for now but consider removing.
 * TODO: Verify usage and remove if unused. Add to README to-do list.
 * General utility functions for DOM manipulation, random numbers, and device detection
 */

/**
 * Check if the current device is mobile
 * Uses CSS custom property --is-mobile set via media query
 *
 * @returns {boolean} True if device is mobile
 */
export function isMobile() {
	return (
		getComputedStyle(document.documentElement).getPropertyValue(
			'--is-mobile',
		) === 'true'
	)
}

/**
 * Wrap an element in a span
 * Useful for applying animations or styles to inline elements
 *
 * @param {HTMLElement} element - Element to be wrapped
 * @returns {HTMLSpanElement} Span element containing the input element
 */
export function wrapInSpan(element) {
	const wrapper = document.createElement('span')
	element.parentNode.insertBefore(wrapper, element)
	wrapper.appendChild(element)
	return wrapper
}

/**
 * Generate random number between range with decimal precision
 *
 * @param {number} low - Lowest number in range (inclusive)
 * @param {number} high - Highest number in range (exclusive)
 * @param {number} [roundTo=4] - Number of decimal places to round to
 * @returns {number} Random number between low and high
 */
export function randBtwn(low, high, roundTo = 4) {
	const raw = Math.random() * (high - low) + low
	return roundToPlace(raw, roundTo)
}

/**
 * Round a number to specified decimal places
 *
 * @param {number} num - Number to round
 * @param {number} roundTo - Number of decimal places
 * @returns {number} Rounded number
 */
export function roundToPlace(num, roundTo) {
	const factor = 10 ** roundTo
	return Math.round(num * factor) / factor
}

/**
 * Generate random integer between range (inclusive on both ends)
 * Non-integer arguments are floored before calculation
 *
 * @param {number} low - Lowest number in range (inclusive)
 * @param {number} high - Highest number in range (inclusive)
 * @returns {number} Random integer between low and high
 */
export function randIntBtwn(low, high) {
	const wL = Math.floor(low)
	const wH = Math.floor(high)
	return Math.floor(Math.random() * (wH - wL + 1) + wL)
}
