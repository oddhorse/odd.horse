/**
 * Tagline rotation system (extracted from header-logo.njk)
 *
 * - Cycles through random taglines with bounce animation
 * - Auto-rotates every 10 seconds
 * - Click tagline to cycle manually and reset timer
 * - Isolated in an IIFE to avoid global scope pollution
 *
 * Implementation notes:
 * - `taglines` are passed via a `data-taglines` attribute on the
 *   `#tagline` element (serialized JSON by Nunjucks).
 * - The module also splits the text logo (`.text-logo`) into
 *   per-letter spans with class `header-logo-piece` for individual
 *   interactions/styles.
 * - This file is safe to load as an ES module (`type="module"`) or
 *   as a plain script; it only runs when the DOM is ready.
 */

import { resumeAudio, playAudio } from './audio.js'

// ===== CONSTANTS =====
const ROTATION_INTERVAL_MS = 10000

// ===== STATE =====
const taglineElement = document.getElementById('tagline')

const logoLinkElement = document.getElementById('logo-link')

const o1Element = document.getElementById("letter-o1")
const d1Element = document.getElementById("letter-d1")
const d2Element = document.getElementById("letter-d2")
const hElement = document.getElementById("letter-h")
const o2Element = document.getElementById("letter-o2")
const rElement = document.getElementById("letter-r")
const sElement = document.getElementById("letter-s")
const eElement = document.getElementById("letter-e")
const iconElement = document.getElementById("letter-icon")

let clickOrder = ""

let o1Clicked = false
let d1Clicked = false
let d2Clicked = false
let hClicked = false
let o2Clicked = false
let rClicked = false
let sClicked = false
let eClicked = false

// Read taglines from data attribute set on the element by Nunjucks
let taglines = []
try {
	const raw = taglineElement && taglineElement.getAttribute('data-taglines')
	if (raw) taglines = JSON.parse(raw)
} catch (err) {
	console.error('Failed to parse taglines for header-logo:', err)
	taglines = []
}

//if (!taglineElement || !Array.isArray(taglines) || taglines.length === 0) return

// Randomize the tagline order once on load
const shuffledTaglines = [...taglines].sort(() => Math.random() - 0.5)

// Mutable state
let currentIndex = 0
let rotationTimer = null

// ===== HELPER FUNCTIONS =====
/** Return the next tagline (wraps to start) */
function getNextTagline() {
	currentIndex = (currentIndex + 1) % shuffledTaglines.length
	return shuffledTaglines[currentIndex]
}

/** Add and later remove the bounce animation class */
function bounceElement(elToBounce) {
	elToBounce.classList.add('hoverwink-animate')
	const animationDuration = parseFloat(getComputedStyle(elToBounce).getPropertyValue('--hoverwink-transition-speed')) * 1000
	setTimeout(() => elToBounce.classList.remove('hoverwink-animate'), animationDuration)
}

/** Swap in next tagline and animate it */
function rotateTagline() {
	taglineElement.innerHTML = getNextTagline()
	bounceElement(taglineElement)
}

/** Start or restart the automatic rotation interval */
function startRotationTimer() {
	if (rotationTimer) clearInterval(rotationTimer)
	rotationTimer = setInterval(rotateTagline, ROTATION_INTERVAL_MS)
}

// ===== EVENT HANDLERS =====
/**
 * registers first element found by given query selector to play specified audio when clicked
 * @param {string} querySelector selector to search element by
 * @param {string} audioKey identifier for sound to play
 */
function registerElClickToAudio(querySelector, audioKey) {
	const el = document.querySelector(querySelector)
	if (el) {
		el.addEventListener('click', async () => {
			await resumeAudio().catch(() => { })
			playAudio(audioKey)
		})
	}
}

// sets letter state to clicked, if unclicked
function clickLetter(letter) {
	if (!(letter.getAttribute('class').includes('clicked'))) {
		letter.classList.add('clicked')
		letter.classList.remove('hoverwink')
	}
}

// resets letter state to unclicked, if clicked
function unclickLetter(letter) {
	if (letter.getAttribute('class').includes('clicked')) {
		letter.classList.remove('clicked')
		letter.classList.add('hoverwink')
	}
}

function isLetterClicked(letter) {
	return letter.getAttribute('class').includes('clicked')
}

/** Attach click handlers for tagline and logo pieces */
function setupClickHandlers() {
	// Click tagline to immediately rotate and reset timer
	taglineElement.addEventListener('click', () => {
		rotateTagline()
		startRotationTimer()
	})

	o1Element.addEventListener('click', () => {
		if (!isLetterClicked(o1Element)) clickOrder += "o"
		console.log(clickOrder)

		clickLetter(o1Element)
	})

	d1Element.addEventListener('click', () => {
		if (!isLetterClicked(d1Element)) clickOrder += "d"
		console.log(clickOrder)
		clickLetter(d1Element)
	})

	d2Element.addEventListener('click', () => {
		if (!isLetterClicked(d2Element)) clickOrder += "D"
		console.log(clickOrder)
		clickLetter(d2Element)
	})

	hElement.addEventListener('click', () => {
		if (!isLetterClicked(hElement)) clickOrder += "h"
		console.log(clickOrder)
		clickLetter(hElement)
	})

	o2Element.addEventListener('click', () => {
		if (!isLetterClicked(o2Element)) clickOrder += "O"
		console.log(clickOrder)
		clickLetter(o2Element)
	})

	rElement.addEventListener('click', () => {
		if (!isLetterClicked(rElement)) clickOrder += "r"
		console.log(clickOrder)
		clickLetter(rElement)
	})

	sElement.addEventListener('click', () => {
		if (!isLetterClicked(sElement)) clickOrder += "s"
		console.log(clickOrder)
		clickLetter(sElement)
	})

	eElement.addEventListener('click', () => {
		if (!isLetterClicked(eElement)) clickOrder += "e"
		console.log(clickOrder)
		clickLetter(eElement)
	})

	iconElement.addEventListener('click', () => {

		if (clickOrder === "odDhOrse") {
			console.log("correct!")
		} else {
			console.log("wrong!")
		}

		clickOrder = ""
		unclickLetter(o1Element)
		unclickLetter(d1Element)
		unclickLetter(d2Element)
		unclickLetter(hElement)
		unclickLetter(o2Element)
		unclickLetter(rElement)
		unclickLetter(sElement)
		unclickLetter(eElement)
	})

	/*
	logoLinkElement.addEventListener('click', (e) => {
		// if order is not correct or on the way to being correct, reset
		if (!(clickOrder === "o" || clickOrder === "od" || clickOrder === "odD" || clickOrder === "odDh" || clickOrder === "odDhO" || clickOrder === "odDhOr" || clickOrder === "odDhOrs" || clickOrder === "odDhOrse")) {
			clickOrder = ""
			console.log("wrong!")
		}

	})

	*/

	// Clicking any letter piece triggers a bounce for fun
	const headerLogoPieces = document.getElementsByClassName('header-logo-piece')
	for (const piece of headerLogoPieces) {
		piece.addEventListener('click', () => bounceElement(piece))
	}

	// Wire logo click to play audio (resume context on first click, then play)
	registerElClickToAudio('.header-logo-piece.letter-icon', "wheel-of-fortune")
	registerElClickToAudio('.header-logo-piece.letter-o1', "o1")
	registerElClickToAudio('.header-logo-piece.letter-d1', "d1")
	registerElClickToAudio('.header-logo-piece.letter-d2', "d2")
	registerElClickToAudio('.header-logo-piece.letter-h', "h")
	registerElClickToAudio('.header-logo-piece.letter-o2', "o2")
	registerElClickToAudio('.header-logo-piece.letter-r', "r")
	registerElClickToAudio('.header-logo-piece.letter-s', "s")
	registerElClickToAudio('.header-logo-piece.letter-e', "e")

}

// ===== AUDIO =====




// ===== BOOTSTRAP =====
/** Initialize logo and start rotation */
export function initHeaderLogo() {
	taglineElement.innerHTML = shuffledTaglines[currentIndex]
	taglineElement.style.opacity = 1
	bounceElement(taglineElement)
	startRotationTimer()
	setupClickHandlers()
}
