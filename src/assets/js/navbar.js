export function setupNavbar() {
	const navlinks = document.querySelectorAll('.navlink')
	const logoContainer = document.querySelector('.logo-container')
	for (const link of navlinks) {
		const navlinkColor = getComputedStyle(link)
			.getPropertyValue('--navbar-link-color')
			.trim()
		link.addEventListener('mouseenter', () => {
			logoContainer.style.setProperty('--logo-color', navlinkColor)
		})
		link.addEventListener('mouseleave', () => {
			logoContainer.style.setProperty('--logo-color', '') //defaultColor
		})
	}
}
