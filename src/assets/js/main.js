import { setupNavbar } from './navbar.js'
import { defineColors } from './colors.js'
import { registerAnimations } from './anim.js'
import { roundToPlace } from './util.js'

document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	registerAnimations()
})
