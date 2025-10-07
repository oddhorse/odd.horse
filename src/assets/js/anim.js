import { wrapInSpan } from './util.js'

export function registerAnimations() {
	const floatingItems = document.querySelectorAll('.floating')
	floatingItems.forEach((item, index) => {
		wrapInSpan(item)
		item.style.display = 'inline-block'
		item.style.animation = 'floatUpDown 3s ease-in-out infinite'
		item.style.animationDelay = `${index * 0.2}s`
	})
}
