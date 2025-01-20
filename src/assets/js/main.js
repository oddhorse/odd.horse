import { setupNavbar } from './navbar.js'
import { defineColors } from './colors.js'
import { registerAnimations } from './anim.js'

document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	registerAnimations()
})
