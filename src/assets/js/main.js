import { defineColors } from './colors.js'
import { setupNavbar } from './navbar.js'

document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	// will try gsap, this doesn't seem very flexible
})
