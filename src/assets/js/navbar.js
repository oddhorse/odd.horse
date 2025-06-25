export function setupNavbar() {
	const navlinks = document.querySelectorAll('.navlink')
	const logoContainer = document.querySelector('.logo-container')
	for (const link of navlinks) {
		const navlinkColor = getComputedStyle(link)
			.getPropertyValue('--navbar-link-color')
			.trim()
		const shadowColor = navlinkColor + 33;
		link.addEventListener('mouseenter', () => {
			logoContainer.style.setProperty('--logo-color', navlinkColor)
			logoContainer.style.setProperty('--logo-shadow-color', shadowColor)
		})
		link.addEventListener('mouseleave', () => {
			logoContainer.style.setProperty('--logo-color', '') //defaultColor
			logoContainer.style.setProperty('--logo-shadow-color', '')
		})
	}
}
