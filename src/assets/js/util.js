export function isMobile() {
	return (
		getComputedStyle(document.documentElement).getPropertyValue(
			'--is-mobile',
		) === 'true'
	)
}

/**
 * wraps given element in a span element
 * @param {*} element element to be wrapped in a span
 * @returns span element containing input element
 */
export function wrapInSpan(element) {
	const wrapper = document.createElement('div')
	element.parentNode.insertBefore(wrapper, element)
	wrapper.appendChild(element)
	return wrapper
}

//TODO: CURRENTLY UNUSED!
