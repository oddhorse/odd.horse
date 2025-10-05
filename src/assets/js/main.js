import { setupNavbar } from './navbar.js'
import { defineColors } from './colors.js'

document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	// will try gsap, this doesn't seem very flexible
})
