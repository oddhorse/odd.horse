// Purpose: functions for rendering elements on the page

/**
 * generates a random decimal value between `-bound` and `bound` (both exclusive), applying an exponential curve to scale probability
 * @param bound maximum value (exclusive) that can be generated, both positively and negatively
 * @param exp exponential curve to apply to random value on each side of axis
 * @returns number duh
 */
export function getRandomDecimalBidirectionalExponential(
	bound: number,
	exp: number,
) {
	if (bound <= 0) throw Error('bound cannot be 0 or negative! try again')
	let n = Math.random() ** exp * bound
	if (Math.random() < 0.5) n *= -1 // 50% chance of being made negative
	return n
} /**
 * add random translation to the specified `HTMLElement` by number of pixels
 * @param el html dom element to add translation to
 * @param xBound max x axis offset, in pixels
 * @param yBound max y axis offset, in pixels
 * @description offsets are applied in either direction—for example, an `hOffsetBounds` of `4` could move the element up *or* down by up to 4 pixels
 */

export function randomTranslate(
	el: HTMLElement,
	xBound: number,
	yBound: number,
) {
	// generate decimal numbers between neg & pos bounds
	const rx = getRandomDecimalBidirectionalExponential(xBound, 0.5)
	const ry = getRandomDecimalBidirectionalExponential(yBound, 0.7)
	el.style.transform = `translate(${rx}px, ${ry}px)`
}

/**
 * add random translation to all elements with the specified query selector
 * @description this function is intended to be called on page load
 */
export function randomTranslateByQuerySelector(
	sel: string,
	xBound: number,
	yBound: number,
) {
	const randEls = document.querySelectorAll(sel)
	if (randEls) {
		for (const el of randEls) {
			console.log(el)

			if (el instanceof HTMLElement) randomTranslate(el, xBound, yBound)
		}
	}
}

/**
 * Applies random translation to all main elements.
 */
export function randomTranslateAll() {
	randomTranslateByQuerySelector('#home .rand', 35, 8)
	randomTranslateByQuerySelector('#main-header .rand', 8, 8)
}

function randomColorNavbarLinks() {
	const links = document.querySelectorAll('#header-links a')
	if (links) {
		for (const link of links) {
			link.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`
		}
	}
}

export function render() {
	randomColorNavbarLinks()
	randomTranslateAll()
}
