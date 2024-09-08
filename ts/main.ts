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
		href: 'https://soundcloud.com/oddhorse',
	},
	{
		name: 'bandcamp',
		color: Color('#00c0de'),
		href: 'https://oddhorse.bandcamp.com',
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
function injectLinks(containerId: string, links: Array<Link>) {
	const containerEl = document.getElementById(containerId)

	if (containerEl == null)
		throw new Error(`no element found with id ${containerId}!`)

	for (const link of links) {
		const linkEl = document.createElement('a')
		linkEl.innerText = link.name
		linkEl.style.color = link.color.hex()
		linkEl.href = link.href
		linkEl.target = '_blank' // opens links in new tabs
		linkEl.rel = 'noopener noreferrer' // prevents tabnabbing exploit
		randomTranslate(linkEl, 35, 6)
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
function randomTranslate(el: HTMLElement, xBound: number, yBound: number) {
	// generate decimal numbers between neg & pos bounds
	const rx = getRandomDecimalBidirectionalExponential(xBound, 0.5)
	const ry = getRandomDecimalBidirectionalExponential(yBound, 0.7)
	el.style.transform = `translate(${rx}px, ${ry}px)`
}

injectLinks('streaming-links', streamingLinks)
injectLinks('social-links', socialLinks)

// randomize elements of rand class
const randEls = document.getElementById('home')?.getElementsByClassName('rand')
if (randEls) {
	for (const el of randEls) {
		if (el instanceof HTMLElement) randomTranslate(el, 35, 5)
	}
}

/**
 * generates a random decimal value between `-bound` and `bound` (both exclusive), applying an exponential curve to scale probability
 * @param bound maximum value (exclusive) that can be generated, both positively and negatively
 * @param exp exponential curve to apply to random value on each side of axis
 * @returns number duh
 */
function getRandomDecimalBidirectionalExponential(bound: number, exp: number) {
	if (bound <= 0) throw Error('bound cannot be 0 or negative! try again')
	let n = Math.random() ** exp * bound
	if (Math.random() < 0.5) n *= -1 // 50% chance of being made negative
	return n
}
