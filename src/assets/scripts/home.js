for (const link of document.querySelectorAll('nav a')) {
	link.addEventListener('mouseover', () => {
		document.body.style.backgroundColor = 'lightblue'
	})
}
