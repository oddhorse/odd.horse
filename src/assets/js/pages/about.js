document.addEventListener('DOMContentLoaded', () => {
	const godElements = document.querySelectorAll('.glow.god-hover')
	const godImage = document.getElementById('god-image')

	for (const element of godElements) {
		element.addEventListener('mouseenter', (event) => {
			godImage.style.display = 'block'
			updateGodImagePosition(godImage, event)
		})

		element.addEventListener('mousemove', (event) => {
			updateGodImagePosition(godImage, event)
		})

		element.addEventListener('mouseleave', () => {
			godImage.style.display = 'none'
		})
	}
})

function updateGodImagePosition(image, event) {
	const godImageRect = image.getBoundingClientRect()
	const viewportWidth = window.innerWidth
	const viewportHeight = window.innerHeight

	let left = event.pageX + 10
	let top = event.pageY + 10

	if (left + godImageRect.width > viewportWidth) {
		left = viewportWidth - godImageRect.width - 10
	}
	if (top + godImageRect.height > viewportHeight) {
		top = viewportHeight - godImageRect.height - 10
	}

	image.style.left = `${left}px`
	image.style.top = `${top}px`
}
