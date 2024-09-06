/**
 * main.ts
 */

/*
TODO: configure auto-copyright profile and automatic source file header comments
 */

import Color from 'color'

// import css files
import 'normalize.css'
import '../styles/style.css'

/**
 * display data for links to be displayed on site
 */
interface Link {
	name: string
	color: Color
	href: string
}

const streamingLinks: Array<Link> = [
	{
		name: 'spotify',
		color: Color('#46f448'),
		href: 'https://open.spotify.com/artist/1gS6MWOwbDZLj9nqDBLdel',
	},
	{
		name: 'apple music',
		color: Color('#ff4242'),
		href: 'https://music.apple.com/artist/1710449134',
	},
	{
		name: 'soundcloud',
		color: Color('#ff9d00'),
		href: 'https://oddhorse.bandcamp.com',
	},
	{
		name: 'bandcamp',
		color: Color('#00c0de'),
		href: 'https://soundcloud.com/oddhorse',
	},
]

const socialLinks: Array<Link> = [
	{
		name: 'instagram',
		color: Color('#de006b'),
		href: 'https://instagram.com/oddhorse_',
	},
	{
		name: 'tiktok',
		color: Color('#000000'),
		href: 'https://www.tiktok.com/@oddhorse',
	},
	{
		name: 'youtube',
		color: Color('#ff0000'),
		href: 'https://www.youtube.com/@oddhorse',
	},
]

/**
 * injects links from an array of `Link`s
 * @param containerId id of html element to inject links in
 * @param links array of `link`s to inject
 */
function injectLinks (containerId: string, links: Array<Link>) {
	const containerEl = document.getElementById(containerId)
	if (containerEl == null)
		throw new Error(`no element found with id ${containerId}!`)
	for (const link of links) {
		let linkEl = document.createElement('a')
		linkEl.innerText = link.name
		linkEl.style.color = link.color.hex()
		linkEl.href = link.href
		randomTranslate(linkEl, 35, 10)
		containerEl.append(linkEl)
	}
}

/**
 * add random translation to the specified `HTMLElement` by number of pixels
 * @param el html dom element to add translation to
 * @param xBound max x axis offset, in pixels
 * @param yBound max y axis offset, in pixels
 * @description offsets are applied in either direction—for example, an `hOffsetBounds` of `4` could move the element up *or* down by up to 4 pixels
 */
function randomTranslate (el: HTMLElement, xBound: number, yBound: number) {
	// generate decimal numbers between neg & pos bounds
	const rx = getRandomDecimalBidirectionalExponential(xBound, .5)
	const ry = getRandomDecimalBidirectionalExponential(yBound, .7)
	el.style.transform = `translate(${rx}px, ${ry}px)`
}

injectLinks('streaming-links', streamingLinks)
injectLinks('social-links', socialLinks)

const headings = document.getElementById("home").getElementsByClassName("heading")

for (const el of headings) {
	randomTranslate(el, 35, 5)
}
injectLinks()

/**
 * returns a random decimal number between `min` and `max` bounds, inclusive of `min` and exclusive of `max`
 * @param min minimum value that can be generated. inclusive
 * @param max maximum value that can be generated. exclusive!
 * @returns number duh
 */
function getRandomDecimalBetween (min: number, max: number) {
	if (min > max) throw Error('min should not be greater than max! try again')
	return Math.random() * (max - min) + min
}

function getRandomDecimalUnidirectional (bound: number) {
	if (bound <= 0) throw Error("bound cannot be 0 or negative! try again")
	return Math.random() * bound
}

function getRandomDecimalBidirectional (bound: number) {
	if (bound <= 0) throw Error("bound cannot be 0 or negative! try again")
	let n = Math.random() * bound
	if (Math.random() < 0.5) n *= -1 // 50% chance of being made negative
	return n
}

/**
 * generates a random decimal value between 0 (inclusive) and `bound` (exclusive), applying an exponential curve to scale probability
 * @param bound maximum value (exclusive) that can be generated
 * @param exp exponential curve to apply to random value
 * @returns value
 */
function getRandomDecimalUnidirectionalExponential (bound: number, exp: number) {
	if (bound <= 0) throw Error("bound cannot be 0 or negative! try again")
	return Math.pow(Math.random(), exp) * bound
}


/**
 * generates a random decimal value between `-bound` and `bound` (both exclusive), applying an exponential curve to scale probability
 * @param bound maximum value (exclusive) that can be generated, both positively and negatively
 * @param exp exponential curve to apply to random value on each side of axis
 * @returns number duh
 */
function getRandomDecimalBidirectionalExponential (bound: number, exp: number) {
	if (bound <= 0) throw Error("bound cannot be 0 or negative! try again")
	let n = Math.pow(Math.random(), exp) * bound
	if (Math.random() < 0.5) n *= -1 // 50% chance of being made negative
	return n
}
