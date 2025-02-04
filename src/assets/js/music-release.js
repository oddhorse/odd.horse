document.addEventListener('DOMContentLoaded', () => {
	const linksPopup = document.getElementById('release-popup')
	const popupButton = document.getElementById('release-popup-button')
	const x = linksPopup.getElementsByClassName('paren-X')[0]

	popupButton.addEventListener('click', () => {
		linksPopup.style.display = 'block'
	})

	linksPopup.addEventListener('click', () => {
		linksPopup.style.display = 'none'
	})

	x.addEventListener('click', () => {
		linksPopup.style.display = 'none'
	})
})
