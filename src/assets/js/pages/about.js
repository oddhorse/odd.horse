import { isMobile } from '../util.js'

document.addEventListener('DOMContentLoaded', () => {
	const godElements = document.querySelectorAll('.glow.god-hover')
	const godImage = document.getElementById('god-image')

	registerPopup(godElements, godImage)

	const pbuhElements = document.querySelectorAll('.pbuh')
	const pbuhPopup = document.getElementById('pbuh-popup')

	registerPopup(pbuhElements, pbuhPopup)
})

function registerPopup(elements, popup) {
	for (const element of elements) {
		element.addEventListener('mouseenter', (event) => {
			if (!isMobile()) {
				triggerPopup(popup, event)
			}
		})

		element.addEventListener('click', (event) => {
			if (isMobile()) {
				triggerPopup(popup, event)
			}
		})

		element.addEventListener('mousemove', (event) => {
			updateImagePosition(popup, event)
		})
		element.addEventListener('mouseleave', () => {})
	}
	popup.addEventListener('animationend', () => {
		popup.style.display = 'none'
		popup.style.animation = 'none'
	})
}

function triggerPopup(popup, event) {
	popup.style.display = 'block'
	popup.style.opacity = 1
	popup.style.animation = 'none'
	popup.offsetHeight
	popup.style.animation = 'fadeOutSustain 2.5s forwards'
	updateImagePosition(popup, event)
}

function updateImagePosition(image, event) {
	const popupImageRect = image.getBoundingClientRect()
	const viewportWidth = window.innerWidth
	const viewportHeight = window.innerHeight

	let left = event.pageX + 10
	let top = event.pageY + 10

	if (left + popupImageRect.width > viewportWidth) {
		left = viewportWidth - popupImageRect.width - 10
	}
	if (top + popupImageRect.height > viewportHeight) {
		top = viewportHeight - popupImageRect.height - 10
	}

	image.style.left = `${left}px`
	image.style.top = `${top}px`
}
