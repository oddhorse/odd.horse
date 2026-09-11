/* church
	by john trinh
	main.js */

window.onload = () => {
	//=====DEMO/TEST ELEMENTS=====//
	const demoToggle = document.getElementById("demo-toggle")
	const demoBox = document.getElementById("demo-box")
	const demoTime = document.getElementById("demo-time")
	const demoRingBtn = document.getElementById("demo-ring-btn")
	const demoRingTwiceBtn = document.getElementById("demo-ring-twice-btn")
	const demoRingSixBtn = document.getElementById("demo-ring-six-btn")
	const demoCongregateBtn = document.getElementById("demo-congregate-btn")
	const demoDisperseBtn = document.getElementById("demo-disperse-btn")
	const demoProtestEarlyBtn = document.getElementById("demo-protest-early-btn")
	const demoProtestBtn = document.getElementById("demo-protest-btn")
	const demoRingOftenTog = document.getElementById("demo-ring-often-toggle")

	//=====ELEMENTS AND STATE=====//
	// audio
	// migrate to Web Audio API buffers (more reliable mixing / mobile unlock)
	const audioContext = new (window.AudioContext || window.webkitAudioContext)()
	const audioFiles = {
		bell: "audio/bell.mp3",
		crowdTalk: "audio/crowd-talking.mp3",
		crowdOoh: "audio/crowd-ooh.mp3",
		crowdWhisper: "audio/crowd-whisper.mp3",
		shh: "audio/shh.mp3",
		knock: "audio/knock.mp3",
		slam: "audio/slam.mp3",
		hammer: "audio/hammer.mp3",
		rustle: "audio/rustle.mp3",
	}
	const audioBuffers = {}
	const activeSources = {} // store sources we may stop (eg. knock)

	// preload & decode all files (non-blocking)
	async function loadAudioFiles() {
		await Promise.all(
			Object.entries(audioFiles).map(async ([key, url]) => {
				try {
					const resp = await fetch(url)
					const ab = await resp.arrayBuffer()
					audioBuffers[key] = await audioContext.decodeAudioData(ab)
				} catch (e) {
					// if fetch/decode fails, leave undefined and fallback to HTMLAudio later
				}
			})
		)
	}
	loadAudioFiles().catch(() => { })

	// resume audioContext on user gesture
	function unlockAudioContext() {
		if (audioContext.state === "suspended") audioContext.resume().catch(() => { })
		window.removeEventListener("touchstart", unlockAudioContext)
		window.removeEventListener("click", unlockAudioContext)
	}
	window.addEventListener("touchstart", unlockAudioContext, { once: true })
	window.addEventListener("click", unlockAudioContext, { once: true })

	/**
	 * playSound - plays a decoded buffer (or falls back to HTMLAudio)
	 * @param {string} name - key from audioFiles
	 * @param {Object} opts
	 * @param {boolean} [opts.loop=false] - loop playback
	 * @param {number} [opts.volume=1] - gain
	 * @param {boolean} [opts.store=false] - store source in activeSources so it can be stopped
	 * @returns {object|undefined} - { stop() } handle for stopping when available
	 */
	function playSound(name, { loop = false, volume = 1, store = false } = {}) {
		const buf = audioBuffers[name]
		if (buf) {
			const src = audioContext.createBufferSource()
			const gain = audioContext.createGain()
			src.buffer = buf
			src.loop = loop
			gain.gain.value = volume
			src.connect(gain)
			gain.connect(audioContext.destination)
			src.start()
			if (store) {
				activeSources[name] = src
			}
			return { stop: () => { try { src.stop() } catch (e) { }; if (activeSources[name] === src) delete activeSources[name] } }
		} else {
			// fallback: ephemeral HTMLAudio (keeps existing behaviour if decode not ready)
			const url = audioFiles[name]
			if (!url) return
			try {
				const a = new Audio(url)
				a.loop = loop
				a.volume = volume
				a.play().catch(() => { })
				if (store) {
					activeSources[name] = a
					return { stop: () => { try { a.pause(); a.currentTime = 0 } catch (e) { }; if (activeSources[name] === a) delete activeSources[name] } }
				}
			} catch (e) { }
		}
	}

	function stopSound(name) {
		const s = activeSources[name]
		if (!s) return
		try {
			if (s.stop) s.stop()
			else { s.pause(); s.currentTime = 0 }
		} catch (e) { }
		delete activeSources[name]
	}

	// elements
	const light = document.getElementById("light")
	const church = document.getElementById("church")
	const world = document.getElementById("world")
	const theses = document.getElementById("theses")
	const bush = document.getElementById("bush")
	const door = document.getElementById("door")
	const congregation = document.getElementById("congregation")
	const hammer = document.getElementById("hammer")
	const martin = document.getElementById("martin")
	const thesesBig = document.getElementById("theses-big")
	const pageTitle = document.getElementById("page-title")
	const shroud = document.getElementById("shroud")

	let ringsRemaining = 0
	let lastHourRung
	let congregating = false
	let hammerFound = false
	let bushClicks = 0
	let hammerActive = false
	let thesesPosted = false

	demoToggle.addEventListener("click", () => {
		demoBox.toggleAttribute("hidden")
	})

	//=====HAMMER AND MARTIN LUTHER=====//

	bush.addEventListener("click", () => {
		tlWiggleBush()
		if (!hammerFound && bushClicks < 3) bushClicks++
		if (!hammerFound && bushClicks === 3) {
			tlHammerFromBush()
			hammerFound = true
		}
	})

	function tlWiggleBush() {
		playSound("rustle")
		bush.animate(
			[
				{ transform: "translateX(-2px)" },
				{ transform: "translateX(2px)" },
			],
			{
				duration: 125,
				iterations: 4,
				delay: 0,
				easing: "ease-in-out",
			}
		)
	}

	function tlHammerFromBush() {
		hammer.style.opacity = "100%"
		hammer.hidden = false
		hammer.style.zIndex = 1
		hammer.animate(
			[
				{ opacity: "0%" },
				{ top: "160px" },
				{ opacity: "100%" },
				{ top: "180px" },
			],
			{
				duration: 500,
				iterations: 1,
				delay: 0,
				easing: "ease-in-out",
			}
		)
		//bush.style.cursor = "inherit"
	}

	function tlFlashMartinLuther() {
		martin.hidden = false
		playSound("bell")
		martin.animate(
			[
				{ opacity: "100%" },
				{ opacity: "100%" },
				{ opacity: "75%" },
				{ opacity: "50%" },
				{ opacity: "25%" },
				{ opacity: "0%" },
			],
			{
				duration: 3000,
				iterations: 1,
				delay: 0,
				easing: "ease-in-out",
			}
		)
		setTimeout(() => {
			playSound("hammer")
		}, 1000)
		setTimeout(() => {
			martin.hidden = true
		}, 3000)
	}

	function tlFlashTheses() {
		thesesBig.hidden = false
		playSound("bell")
		thesesBig.animate(
			[
				{ opacity: "100%" },
				{ opacity: "100%" },
				{ opacity: "75%" },
				{ opacity: "50%" },
				{ opacity: "25%" },
				{ opacity: "0%" },
			],
			{
				duration: 3000,
				iterations: 1,
				delay: 0,
				easing: "ease-in-out",
			}
		)
		setTimeout(() => {
			thesesBig.hidden = true
		}, 3000)
	}

	hammer.addEventListener("click", () => {
		// https://vueschool.io/articles/vuejs-tutorials/how-to-update-root-css-variable-with-javascript/
		hammer.hidden = true
		setHammerCursor()
	})

	function setHammerCursor() {
		// document.documentElement.style.cursor = "url('images/hammer.png'), auto"
		world.style.cursor = "url('images/hammer.png'), auto"
		hammerActive = true
	}

	function removeHammerCursor() {
		// document.documentElement.style.cursor = ""
		world.style.cursor = ""
		hammerActive = false
	}

	theses.addEventListener("click", () => {
		tlFlashTheses()
	})


	//=====BELL HANDLING=====//

	/**
	 * returns number of times in written form for title
	 * @param {number} count - number of times bell rings
	 * @returns word form
	 */
	function getCountWord(count) {
		switch (count) {
			case 1:
				return "once"
			case 2:
				return "twice"
			case 3:
				return "thrice"
			case 4:
				return "four times"
			case 5:
				return "five times"
			case 6:
				return "six times"
			case 7:
				return "seven times"
			case 8:
				return "eight times"
			case 9:
				return "nine times"
			case 10:
				return "ten times"
			case 11:
				return "eleven times"
			case 12:
				return "twelve times"
			default:
				return "many times"
		}
	}

	/**
	 * starts church bell ringing number of times.
	 * @param {number} count - number of times it plays
	 */
	function ringChurchBell(count) {
		for (let i = 1; i <= count; i++) {
			const timeTil = (i - 1) * 3300
			setTimeout(() => {
				playSound("bell")
				pageTitle.innerText = `the bell tolls ${getCountWord(i)}`
				tlShineLightUponChurch()
			}, timeTil)
		}
		setTimeout(() => {
			pageTitle.innerText = "church"
		}, (count + 2) * 3300)
	}

	function tlShineLightUponChurch() {
		light.animate(
			[
				{ opacity: "0%" },
				{ opacity: "100%" },
			],
			{
				duration: 50,
				iterations: 1,
				delay: 90,
				easing: "linear",
			}
		)
		light.animate(
			[
				{ opacity: "100%" },
				{ opacity: "0%" },
			],
			{
				duration: 3500,
				iterations: 1,
				delay: 140,
				easing: "linear",
			}
		)
		world.animate(
			[
				{ rotate: "0deg" },
				{ rotate: "3deg" },
			],
			{
				duration: 30,
				iterations: 1,
				delay: 90,
				easing: "linear",
			}
		)
		world.animate(
			[
				// { scale: "100%" },
				{ rotate: "3deg" },
				{ rotate: "0deg" },
			],
			{
				duration: 2500,
				iterations: 1,
				delay: 120,
				easing: "linear",
			}
		)
	}

	// DEMO BUTTONS
	demoRingBtn.addEventListener("click", () => {
		ringChurchBell(1)
	})
	demoRingTwiceBtn.addEventListener("click", () => {
		ringChurchBell(2)
	})
	demoRingSixBtn.addEventListener("click", () => {
		ringChurchBell(6)
	})

	//=====CONGREGATION=====//
	/**
	 * gather congregation
	 */
	function tlGoToChurch() {
		if (congregating) {
			console.log("already congregating")
			return
		}
		congregating = true
		playSound("crowdTalk")
		const r = door.getBoundingClientRect()
		console.log(`left: ${r.left}px, top: ${r.top}px`)
		congregation.animate(
			[
				{ left: "100%", top: "50%", scale: "80%" },
				{ left: `${r.left - 50}px`, top: `${r.top + 22}px`, scale: "40%" },
			],
			{
				duration: 2500,
				iterations: 1,
				delay: 0,
				easing: "linear",
			}
		)
		world.animate(
			[
				{ scale: "100%" },
				{ scale: "103%" },
				{ scale: "100%" },
			],
			{
				duration: 100,
				iterations: 1,
				delay: 2400,
				easing: "steps(2)",
			}
		)
		setTimeout(() => {
			playSound("slam")
		}, 2400)
	}

	/**
	 * disperse congregation
	 */
	function tlLeaveChurch() {
		if (!congregating) {
			console.log("nobody's in there")
			return
		}
		congregating = false
		playSound("crowdTalk")
		playSound("slam")
		const r = door.getBoundingClientRect()
		congregation.animate(
			[
				{ left: `${r.left - 60}px`, top: `${r.top + 8}px`, scale: "-40% 40%" }, // note neg x val to flip image
				{ left: "100%", top: "50%", scale: "-80% 80%" },
			],
			{
				duration: 2500,
				iterations: 1,
				delay: 100,
				easing: "linear",
			}
		)
		world.animate(
			[
				{ scale: "100%" },
				{ scale: "103%" },
				{ scale: "100%" },
			],
			{
				duration: 100,
				iterations: 1,
				delay: 0,
				easing: "steps(2)",
			}
		)
	}

	/**
	 * congregants leave the church during service and read the door and go home
	 */
	function tlEndSermonEarly() {
		if (!congregating) {
			console.log("nobody's in there")
			return
		}
		congregating = false
		playSound("slam")
		world.animate(
			[
				{ scale: "100%" },
				{ scale: "103%" },
				{ scale: "100%" },
			],
			{
				duration: 100,
				iterations: 1,
				delay: 0,
				easing: "steps(2)",
			}
		)
		const r = door.getBoundingClientRect()
		setTimeout(() => {
			congregation.classList.remove("walking")
			congregation.style.animationPlayState = ""
			playSound("crowdOoh")
			congregation.animate(
				[
					{ left: `${r.left - 50}px`, top: `${r.top + 22}px`, scale: "40%" },
					{ left: `${r.left - 50}px`, top: `${r.top + 22}px`, scale: "40%" },
				],
				{
					duration: 1350,
					iterations: 1,
					delay: 0,
					easing: "steps(2)",
				}
			)
		}, 100)
		// hesitate then leave
		setTimeout(() => {
			congregation.classList.add("walking")
			playSound("crowdWhisper")
			congregation.animate(
				[
					{ left: `${r.left - 50}px`, top: `${r.top + 22}px`, scale: "-40% 40%" },
					{ left: "100%", top: "50%", scale: "-80% 80%" },
				],
				{
					duration: 2500,
					iterations: 1,
					delay: 0,
					easing: "linear",
				}
			)
		}, 1450)
	}

	/**
	 * congregants approach church and hesitate at the door and then leave
	 */
	function tlProtestTheChurch() {
		if (congregating) {
			console.log("already inside!")
			return
		}
		playSound("crowdTalk")
		const r = door.getBoundingClientRect()
		congregation.animate(
			[
				{ left: "100%", top: "50%", scale: "80%" },
				{ left: `${r.left - 50}px`, top: `${r.top + 22}px`, scale: "40%" }, // stop at door
			],
			{
				duration: 2500,
				iterations: 1,
				delay: 0,
				easing: "linear",
			}
		)
		setTimeout(() => {
			congregation.classList.remove("walking")
			congregation.style.animationPlayState = ""
			playSound("crowdOoh")
			congregation.animate(
				[
					{ left: `${r.left - 50}px`, top: `${r.top + 22}px`, scale: "40%" },
					{ left: `${r.left - 50}px`, top: `${r.top + 22}px`, scale: "40%" },
				],
				{
					duration: 1350,
					iterations: 1,
					delay: 0,
					easing: "steps(2)",
				}
			)
		}, 2500)
		// hesitate then leave
		setTimeout(() => {
			congregation.classList.add("walking")
			playSound("crowdWhisper")
			congregation.animate(
				[
					{ left: `${r.left - 50}px`, top: `${r.top + 22}px`, scale: "-40% 40%" },
					{ left: "100%", top: "50%", scale: "-80% 80%" },
				],
				{
					duration: 2500,
					iterations: 1,
					delay: 0,
					easing: "linear",
				}
			)
		}, 3850)
	}

	// DEMO BUTTONS
	demoCongregateBtn.addEventListener("click", () => {
		tlGoToChurch()
	})
	demoDisperseBtn.addEventListener("click", () => {
		tlLeaveChurch()
	})

	demoProtestEarlyBtn.addEventListener("click", () => {
		tlEndSermonEarly()
	})

	demoProtestBtn.addEventListener("click", () => {
		tlProtestTheChurch()
	})


	//=====TIMER EVENTS!!!!!!=====//

	setInterval(() => {
		let time = new Date()
		let hr = time.getHours()
		let hr12 = (hr + 24) % 12 || 12 // https://stackoverflow.com/questions/10556879/changing-the-1-24-hour-to-1-12-hour-for-the-gethours-method
		let min = time.getMinutes()
		let sec = time.getSeconds()
		let day = time.getDay() // sunday === 0

		demoTime.innerText = time.toLocaleString()

		// ring bell every hour
		if (min === 0 && sec == 0) ringChurchBell(hr12)
		// if ring often is on, ring twice every 10 sec
		else if (demoRingOftenTog.checked && (sec % 10 == 0)) ringChurchBell(2)


		// on sundays
		if (day === 0) {
			// early congregation 
			if (hr === 9 && min === 15 && sec === 0) {
				if (thesesPosted) tlProtestTheChurch()
				else tlGoToChurch()
			}
			if (hr === 10 && min === 30 && sec === 0 && !thesesPosted) tlLeaveChurch()

			// late congregation
			if (hr === 10 && min === 45 && sec === 0) {
				if (thesesPosted) tlProtestTheChurch()
				else tlGoToChurch()
			}
			if (hr === 12 && min === 0 && sec === 0 && !thesesPosted) tlLeaveChurch()
		}
	}, 1000)

	church.addEventListener("click", () => {
		if (hammerActive) {
			tlFlashMartinLuther()
			theses.hidden = false
			thesesPosted = true
			removeHammerCursor()

			setTimeout(() => {
				if (congregating) {
					tlEndSermonEarly()
				} else {
					tlProtestTheChurch()
				}
			}, 2500)
			return
		}
		playSound("knock", { store: true })
		if (congregating) {
			setTimeout(() => {
				playSound("shh")
				setTimeout(() => {
					stopSound("knock")
				}, 450)
			}, 100)
		}
	})

	shroud.addEventListener("click", () => {
		shroud.classList.add("gone")
	})

	//=====UTILITY=====//

	//function ()
}

