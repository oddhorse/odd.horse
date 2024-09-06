/*
 * scatter.js copyright (c) 2022 oddhorse all rights reserved uwu
 */

/** html snippet
	<a href="#" id="logo-hoverbox" class="scatter" onmouseover="agitate('oddhorse', this, elLogoText)"
		onmouseout="returnTo('oddhorse', this, elLogoText)">
		<p id="logo-text">oddhorse</p>
	</a>
	<script type="module" src="/src/scatter.ts"></script>
*/


/*
TODO: implement random fluctuation modes
TODO: make custom font
TODO: make char variants (finish building `CHARS` const)
 */

import 'styles/scatter.css' // imports styling for css elements

let lastTime: number
let ticker = 0
let limit = Math.random() * 1500 + 500
let chaosScaleDefault = 0.8
let chaosScaleAgitated = 0.2
let chaosScale = chaosScaleDefault




const CHARS = {
	o: "oOºȮȯᴼᵒỌọ🄞⒪Ⓞⓞ🄾🅞🅾Ｏｏ𝐎𝐨𝑂𝑜𝑶𝒐𝒪𝓞𝓸𝔒𝔬𝕆𝕠𝕺𝖔𝖮𝗈𝗢𝗼𝘖𝘰𝙊𝙤𝙾𝚘".split(""),
	d: "♪♫♬♭𝄫♮♯𝄞♩",
	h: "�",
}

function playAnimation (time: number) {
	if (lastTime != null) {
		const delta = time - lastTime
		ticker += delta

		if (ticker >= limit) {
			ticker = 0
			limit = Math.random() * 1500 + 500
			scatter("oddhorse".split(""), elLogoText)
		}
	}

	lastTime = time
	window.requestAnimationFrame(playAnimation)
}

const elLogoText = document.getElementById("logo-text")!
const scatterBox = document.getElementById("logo-hoverbox")!

function rand (scale: number) {
	let num = Math.random()
	let scaleFlavor = (Math.random() - 0.5) * scale
	return scale * 2 * num - scale + scaleFlavor
}

function scatter (chars: Array<string>, el: HTMLElement) {
	let spanned = ""
	for (let i = 0; i < chars.length; i++) {
		/*
		if (chars[i] === "o")
			chars[i] = CHARS.o[Math.floor(Math.random() * CHARS.o.length)]
		if (chars[i] === "d")
			chars[i] = CHARS.d[Math.floor(Math.random() * CHARS.d.length)]
		if (chars[i] === "h")
			chars[i] = CHARS.h[Math.floor(Math.random() * CHARS.h.length)]
		*/
		spanned += `<span style="position:relative;top:${rand(
			chaosScale
		)}em;left:${rand(chaosScale * 0.5)}em;">${chars[i]}</span>`
	}
	el.innerHTML = spanned
}

scatterBox.onmouseover = function () {
	scatterBox.style.padding = "2em"
	scatterBox.style.margin = "-2em"
	chaosScale = chaosScaleAgitated
	ticker = 0
	// immediately redraw it for ui snappiness
	scatter(text.split(""), elLogoText)
}
scatterBox.onmouseout = function () {
	// clearInterval(timer);
	chaosScale = chaosScaleDefault
	scatterBox.style.padding = "2em"
	scatterBox.style.margin = "-2em"
}

const text = "oddhorse"
scatter(text.split(""), elLogoText)
window.requestAnimationFrame(playAnimation)
