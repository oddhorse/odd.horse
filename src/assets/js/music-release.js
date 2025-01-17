document.addEventListener('DOMContentLoaded', () => {
	const linksPopup = document.getElementById('release-popup')
	const popupButton = document.getElementById('release-popup-button')

	popupButton.addEventListener('click', () => {
		linksPopup.style.display = 'block'
	})

	linksPopup.addEventListener('click', () => {
		linksPopup.style.display = 'none'
	})
})
