export function setupNavbar() {
	const navlinks = document.querySelectorAll('.navlink')
	const textLogo = document.querySelector('.text-logo')
	for (const link of navlinks) {
		const navlinkColor = getComputedStyle(link)
			.getPropertyValue('--navbar-link-color')
			.trim()
		link.addEventListener('mouseenter', () => {
			textLogo.style.color = navlinkColor
		})
		link.addEventListener('mouseleave', () => {
			textLogo.style.color = '' //defaultColor
		})
	}
}
