module.exports = (eleventyConfig) => {
	// Copy static assets to the output folder
	eleventyConfig.addPassthroughCopy('src/assets')

	return {
		dir: {
			input: 'src',
			output: 'dist',
			includes: '_includes',
			layouts: '_layouts',
		},
	}
}
