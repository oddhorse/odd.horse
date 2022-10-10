/*
 * scatter.js copyright (c) 2022 oddhorse all rights reserved uwu
 */

let timer;
let lastTime;
let ticker = 0;
let limit = Math.random() * 1500 + 500;
let chaosScale = 0.1;

function playAnimation(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ticker += delta;

    if (ticker >= limit) {
      ticker = 0;
      limit = Math.random() * 1500 + 500;
      scatter ("oddhorse".split(""), "oddhorse", elLogoText);
    }
  }

  lastTime = time;
  window.requestAnimationFrame(playAnimation);
}

const elLogoText = document.getElementById("logo-text");

function randOld (scale) {
  let num = Math.random();
  return scale * 2 * num - scale;
}

function rand (scale) {
  let num = Math.random();
  let scaleFlavor = Math.random() - 0.5;
  return scale * 2 * num - scale + scaleFlavor;
}

function scatter (chars, text, el) {
  let spanned = "";
  for (let i = 0; i < chars.length; i++) {
    spanned += `<span style="position:relative;top:${rand(chaosScale)}em;left:${rand(chaosScale * 0.5)}em;">${chars[i]}</span>`
  }
  el.innerHTML = spanned;
}

function agitate (text, hoverBox, el) {
  hoverBox.style.padding = "2em";
  hoverBox.style.margin = "-2em";
  const chars = text.split("");
  chaosScale = 1;
  ticker = 0;
  scatter(chars, text, el);
  // timer = setInterval(scatter, 350, chars, text, el)
}

function returnTo (text, hoverBox, el) {
  // clearInterval(timer);
  chaosScale = 0.1;
  hoverBox.style.padding = "0";
  hoverBox.style.margin = "0";
}
window.requestAnimationFrame(playAnimation);
