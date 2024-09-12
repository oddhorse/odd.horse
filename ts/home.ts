// Purpose: injects links into the home page

import Color from 'color'
import { randomTranslate } from './rendering'

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
		const cleanLinkName = link.name.replace(/\s+/g, '')
		const linkEl = document.createElement('a')
		linkEl.innerText = link.name
		linkEl.id = `link-${cleanLinkName}`
		linkEl.href = link.href
		linkEl.target = '_blank' // opens links in new tabs
		linkEl.rel = 'noopener noreferrer' // prevents tabnabbing exploit
		randomTranslate(linkEl, 35, 6)
		containerEl.append(linkEl)
	}
}

injectLinks('streaming-links', streamingLinks)
injectLinks('social-links', socialLinks)

console.log('home.ts loaded')
