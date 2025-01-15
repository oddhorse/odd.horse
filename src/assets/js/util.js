export function isMobile() {
	return (
		getComputedStyle(document.documentElement).getPropertyValue(
			'--is-mobile',
		) === 'true'
	)
}
