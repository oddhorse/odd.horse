import { defineColors } from './colors.js'
import { setupNavbar } from './navbar.js'
import { initArtifactTracking } from './artifacts.js'

document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	initArtifactTracking()
})
