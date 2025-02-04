import { setupNavbar } from './navbar.js'
import { defineColors } from './colors.js'
import { registerAnimations } from './anim.js'
import { roundToPlace } from './util.js'

document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	// will try gsap, this doesn't seem very flexible
	//registerAnimations()
})
