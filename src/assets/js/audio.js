/**
 * audio.js
 * manages global audio context for things
 */

// Lazy-created AudioContext and caches
let audioCtx = null
let masterGain = null
const buffers = new Map() // key -> AudioBuffer
const activeSources = new Map() // key -> current AudioBufferSourceNode

/**
 * Initializes the global AudioContext and master gain node (lazy singleton)
 * @returns {AudioContext} The initialized or existing AudioContext instance
 */
export function initAudioCtx() {
	if (audioCtx) return audioCtx
	audioCtx = new (window.AudioContext || window.webkitAudioContext)()
	masterGain = audioCtx.createGain()
	masterGain.gain.value = 1
	masterGain.connect(audioCtx.destination)
	return audioCtx
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
 * Plays a cached audio buffer by key. Restarts if already playing.
 * @param {string} key - Identifier for the sound to play
 * @param {Object} [options] - Playback options
 * @param {number} [options.volume=0.6] - Playback volume (0.0 to 1.0)
 * @returns {void}
 */
export function playAudio(key, { volume = 0.6 } = {}) {
	if (!audioCtx) initAudioCtx()
	const buf = buffers.get(key)
	if (!buf) return
	// If there's already a source for this key, stop it so the sound restarts
	if (activeSources.has(key)) {
		try {
			const prev = activeSources.get(key)
			prev.stop()
		} catch (e) {
			// ignore
		}
		activeSources.delete(key)
	}

	const src = audioCtx.createBufferSource()
	src.buffer = buf
	const gain = audioCtx.createGain()
	gain.gain.value = volume
	src.connect(gain).connect(masterGain)
	// remove reference when finished
	src.onended = () => {
		if (activeSources.get(key) === src) activeSources.delete(key)
	}
	src.start(0)
	activeSources.set(key, src)
}

/**
 * Stops a currently playing audio source by key
 * @param {string} key - Identifier for the sound to stop
 * @returns {void}
 */
export function stopAudio(key) {
	if (!audioCtx) return
	const src = activeSources.get(key)
	if (src) {
		try { src.stop() } catch (e) { }
		activeSources.delete(key)
	}
}

/**
 * Resumes the AudioContext if suspended (required after user gesture for autoplay policy)
 * @returns {Promise<void>}
 */
export async function resumeAudio() {
	if (!audioCtx) initAudioCtx()
	if (audioCtx.state === 'suspended') await audioCtx.resume()
}
