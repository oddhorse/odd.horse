/*
 * scatter.js copyright (c) 2022 oddhorse all rights reserved uwu
 */

/*
TODO: implement random fluctuation modes
TODO: make custom font
 */

let timer
let lastTime
let ticker = 0
let limit = Math.random() * 1500 + 500
let chaosScale = 1

const CHARS = {
  o: "oOºȮȯᴼᵒỌọ🄞⒪Ⓞⓞ🄾🅞🅾Ｏｏ𝐎𝐨𝑂𝑜𝑶𝒐𝒪𝓞𝓸𝔒𝔬𝕆𝕠𝕺𝖔𝖮𝗈𝗢𝗼𝘖𝘰𝙊𝙤𝙾𝚘".split(""),
  d: "♪♫♬♭𝄫♮♯𝄞♩",
  h: "�",
}

function playAnimation(time) {
  if (lastTime != null) {
    const delta = time - lastTime
    ticker += delta

    if (ticker >= limit) {
      ticker = 0
      limit = Math.random() * 1500 + 500
      scatter("oddhorse".split(""), "oddhorse", elLogoText)
    }
  }

  lastTime = time
  window.requestAnimationFrame(playAnimation)
}

const elLogoText = document.getElementById("logo-text")

function randOld(scale) {
  let num = Math.random()
  return scale * 2 * num - scale
}

function rand(scale) {
  let num = Math.random()
  let scaleFlavor = (Math.random() - 0.5) * scale
  return scale * 2 * num - scale + scaleFlavor
}

function scatter(chars, text, el) {
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

function agitate(text, hoverBox, el) {
  hoverBox.style.padding = "2em"
  hoverBox.style.margin = "-2em"
  const chars = text.split("")
  chaosScale = 0.2
  ticker = 0
  scatter(chars, text, el)
  // timer = setInterval(scatter, 350, chars, text, el)
}

function returnTo(text, hoverBox, el) {
  // clearInterval(timer);
  chaosScale = 0.8
  hoverBox.style.padding = "0"
  hoverBox.style.margin = "0"
}
window.requestAnimationFrame(playAnimation)
