export function isMobile() {
	return (
		getComputedStyle(document.documentElement).getPropertyValue(
			'--is-mobile',
		) === 'true'
	)
}

/**
 * wraps given element in a span element
 * @param {HTMLElement} element element to be wrapped in a span
 * @returns span element containing input element
 */
export function wrapInSpan(element) {
	const wrapper = document.createElement('span')
	element.parentNode.insertBefore(wrapper, element)
	wrapper.appendChild(element)
	return wrapper
}

/**
 * generates (pseudo, whatever etc)-random number between given range, rounded to configure number of decimal places
 * @param {number} low lowest number in range (incl)
 * @param {number} high highest number in range (excl)
 * @param {number} [roundTo=4] number of decimal places to round answer to. defaults to 4
 * @returns rand number between range
 */
export function randBtwn(low, high, roundTo = 4) {
	const raw = Math.random() * (high - low) + low
	return roundToPlace(raw, roundTo)
}

/**
 * rounds a number to specified number of decimal places
 * @param {number} num number to round
 * @param {number} roundTo number of decimal places to round `num` to
 * @returns rounded number
 */
export function roundToPlace(num, roundTo) {
	const mag = 10 ** roundTo
	return Math.round(num * mag) / mag
}

/**
 * generates (pseudo)-random integer between given range, inclusive. if arguments passed are not integers, they are floored!
 * @param {number} low lowest number in range (incl)
 * @param {number} high highest number in range (incl)
 * @returns rand number between range
 */
export function randIntBtwn(low, high) {
	const wL = Math.floor(low)
	const wH = Math.floor(high)
	return Math.floor(Math.random() * (wH - wL + 1) + wL)
}

//TODO: CURRENTLY UNUSED!
