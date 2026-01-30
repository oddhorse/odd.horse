import { playAudio, resumeAudio } from './audio.js'

const NUM_IMAGES = 47
const MIN_HORSES = 15
const MAX_HORSES = 25

export function initStampede() {
	const stampedeLink = getStampedeLink()
	if (stampedeLink) {
		stampedeLink.addEventListener('click', (e) => {
			e.preventDefault()
			stampede()
		})
	}
}

function getStampedeLink() {
	const stampedeArtifact = document.querySelector('[data-artifact-id="stampede"]')
	if (stampedeArtifact) {
		return stampedeArtifact.querySelector('.artifact-link')
	}
	else return null
}

/**
 * sticks horses of specified nums in the body
 * @param {Array<number>} horseNums 
 */
function spawnHorses(horseNums) {
	const frag = document.createDocumentFragment()
	console.log(horseNums)
	for (let i = 0; i < horseNums.length; i++) {
		const horse = document.createElement('img')
		horse.src = `/assets/images/stampede/horse-${horseNums[i]}.png`
		horse.className = 'stampede-horse'
		horse.alt = `Horse ${horseNums[i]}`
		horse.style.top = `${0 + Math.random() * 80}%`
		horse.style.width = `${150 + Math.random() * 60}px`
		horse.style.height = horse.style.width
		horse.style.animationDuration = `${2 + Math.random()}s`
		horse.style.left = `${-150 - randIntBtwn(0, 200)}px`

		horse.addEventListener('animationend', () => {
			horse.remove()
			console.log(`Horse ${i + 1} finished`)
			reenableStampedeButtonIfNoHorses()
		})
		frag.appendChild(horse)


	}
	document.body.appendChild(frag)
}

function reenableStampedeButtonIfNoHorses() {
	const horses = document.getElementsByClassName("stampede-horse")
	console.log("testing if no horses")
	if (!horses[0]) {
		console.log("no more horses")
		const stampedeLink = getStampedeLink()
		if (stampedeLink) {
			stampedeLink.style.pointerEvents = 'auto'
			console.log("reenabled stampede link")
		}
	}
}

function pickRandHorses(num) {
	let arr = []
	for (let i = 1; i <= NUM_IMAGES; i++) { arr.push(i) }
	let horses = []
	for (let i = 1; i <= num; i++) {
		const randItem = randIntBtwn(0, arr.length - 1)
		const target = arr.splice(randItem, 1)[0]
		horses.push(target)
	}
	return horses
}

function randIntBtwn(min, max) {
	let x = Math.random() * (max - min) + min
	x = Math.floor(x)
	return x
}

async function stampede() {
	const stampedeLink = getStampedeLink()
	if (stampedeLink) { stampedeLink.style.pointerEvents = 'none' }

	// let's get some horses in here
	const numHorses = randIntBtwn(MIN_HORSES, MAX_HORSES)
	const randHorses = pickRandHorses(numHorses)
	spawnHorses(randHorses)

	// play audio
	await resumeAudio()
	playAudio('wheel-of-fortune', { volume: 0.5 })





}

//[TODO] remove this!!!
// Expose helpers for quick console testing
if (typeof window !== 'undefined') {
	window.pickRandHorses = pickRandHorses
	window.randIntBtwn = randIntBtwn
}

// Eagerly load all horses after page loads
window.addEventListener('load', () => {
	for (let i = 1; i <= 47; i++) {
		const img = new Image();
		img.src = `/assets/images/stampede/horse-${i}.png`;
	}
});