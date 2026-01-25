/**
 * audio.js
 * manages global audio context for things
 */

// Lazy-created AudioContext and caches
let audioCtx = null
let masterGain = null
const buffers = new Map() // key -> AudioBuffer

/**
 * loads a piece of audio from given ogg/mp3 locations given browser capabilities
 * @param {Array<string>} urls - locations of one sound in both ogg and mp3 formats
 * @returns the audiobuffer wrapped in a promise
 */
export function initAudioCtx() {
	if (audioCtx) return audioCtx
	audioCtx = new (window.AudioContext || window.webkitAudioContext)()
	masterGain = audioCtx.createGain()
	masterGain.gain.value = 1
	masterGain.connect(audioCtx.destination)
	return audioCtx
}

export function setupAudio() {
	// Initialize AudioContext lazily and arrange a first-user-gesture preload
	initAudioCtx()

	function onceLoad() {
		document.removeEventListener('pointerdown', onceLoad)
		// preload under key 'click'
		loadAudio('click', ['/assets/audio/click.ogg', '/assets/audio/click.mp3']).catch(() => { })
	}
	document.addEventListener('pointerdown', onceLoad, { once: true })

	//[TODO] remove/use for audio playback registration code
	// central click handler for logo playback
	const logo = document.querySelector('.logo-link')
	if (logo) {
		logo.addEventListener('click', async () => {
			try { await resumeAudio() } catch (e) { }
			playAudio('click')
		})
	}
}

/**
 * loads a piece of audio from given ogg/mp3 locations given browser capabilities, and saves it to a key for easy recall
 * @param {string} key string identifier to cache the decoded buffer under
 * @param {Array<string>} urls array of candidate URLs (ogg then mp3)
 */
export async function loadAudio(key, urls) {
	if (!audioCtx) initAudioCtx()
	if (buffers.has(key)) return buffers.get(key)

	const audio = new Audio()
	const prefer = urls.find(u => {
		const ext = u.split('.').pop()
		if (ext === 'ogg') return audio.canPlayType('audio/ogg; codecs="opus"') !== ''
		if (ext === 'mp3') return audio.canPlayType('audio/mpeg') !== ''
		return true
	}) || urls[0]

	const res = await fetch(prefer)
	const arrayBuffer = await res.arrayBuffer()
	const buf = await audioCtx.decodeAudioData(arrayBuffer)
	buffers.set(key, buf)
	return buf
}

/**
 * plays audio buffer
 * @param {string} key identifier for sound to play
 * @param {number} volume well
 */
export function playAudio(key, { volume = 0.6 } = {}) {
	if (!audioCtx) initAudioCtx()
	const buf = buffers.get(key)
	if (!buf) return
	const src = audioCtx.createBufferSource()
	src.buffer = buf
	const gain = audioCtx.createGain()
	gain.gain.value = volume
	src.connect(gain).connect(masterGain)
	src.start(0)
}

/**
 * wakes that thang back up
 */
export async function resumeAudio() {
	if (!audioCtx) initAudioCtx()
	if (audioCtx.state === 'suspended') await audioCtx.resume()
}
