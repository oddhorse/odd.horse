export function hideElementById(id: string) {
	const el = document.getElementById(id)
	if (!el) throw Error('Element not found')
	el.hidden = true
	console.log('Element hidden:', id)
}

export function unhideElementById(id: string) {
	const el = document.getElementById(id)
	if (!el) throw Error('Element not found')
	el.hidden = false
}
