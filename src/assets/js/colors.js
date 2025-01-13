function hexToHSL(hex) {
	// Convert HEX to RGB
	const r = Number.parseInt(hex.slice(1, 3), 16) / 255
	const g = Number.parseInt(hex.slice(3, 5), 16) / 255
	const b = Number.parseInt(hex.slice(5, 7), 16) / 255

	// Find min and max values
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h
	let s
	const l = (max + min) / 2

	if (max === min) {
		h = s = 0 // Achromatic
	} else {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		h =
			60 *
			(r === max
				? (g - b) / d + (g < b ? 6 : 0)
				: g === max
					? (b - r) / d + 2
					: (r - g) / d + 4)
	}

	return {
		h: Math.round(h),
		s: `${Math.round(s * 100)}%`,
		l: `${Math.round(l * 100)}%`,
	}
}

// Helper function to darken the color (adjust lightness)
function darkenColor(hex, percent = 10) {
	const hsl = hexToHSL(hex)
	const newLightness = Math.max(0, Number.parseInt(hsl.l) - percent) // Ensure no negative lightness
	return `hsl(${hsl.h}, ${hsl.s}, ${newLightness}%)`
}

// Helper function to lighten the color (adjust lightness)
function lightenColor(hex, percent = 10) {
	const hsl = hexToHSL(hex)
	const newLightness = Math.min(100, Number.parseInt(hsl.l) + percent) // Ensure no lightness > 100
	return `hsl(${hsl.h}, ${hsl.s}, ${newLightness}%)`
}

export function defineColors(color) {
	const doc = document.documentElement
	let pageColor
	if (color) {
		// Set CSS variables dynamically
		doc.style.setProperty('--page-color', color)
		pageColor = color
	} else {
		pageColor = getComputedStyle(doc).getPropertyValue('--page-color')
	}

	// Convert the HEX color to HSL for dynamic adjustments
	const hsl = hexToHSL(pageColor)

	// Set CSS variables dynamically
	doc.style.setProperty('--link-color', pageColor)
	doc.style.setProperty('--link-hover-color', darkenColor(pageColor))
	doc.style.setProperty('--button-background-color', pageColor)
	doc.style.setProperty('--accent-background', lightenColor(pageColor))
	doc.style.setProperty('--hover-background', darkenColor(pageColor, 20))
}
