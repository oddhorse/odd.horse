import { defineConfig } from 'vite'
import glob from 'fast-glob'

export default defineConfig({
	root: 'src', // Serve files from the 11ty output directory
	build: {
		outDir: 'dist/assets',
		emptyOutDir: false, // Prevent clearing 11ty's output
		rollupOptions: {
			input: {
				// Dynamically include all js files in 'src/scripts/'
				...Object.fromEntries(
					glob
						.sync('src/scripts/*.js')
						.map((file) => [
							file.replace('src/scripts/', '').replace('.js', ''),
							file,
						]),
				),
				// Dynamically include all stylesheet files in 'src/styles/'
				...Object.fromEntries(
					glob
						.sync('src/styles/*.scss') // Or '*.css' if you're using regular CSS
						.map((file) => [
							file.replace('src/styles/', '').replace('.scss', ''),
							file,
						]),
				),
			},
			output: {
				entryFileNames: '[name].js',
				assetFileNames: '[name].[ext]', // For stylesheets, images, etc.
			},
		},
	},
	server: {
		open: true, // Automatically open the browser
		root: '../dist', // Serve files from the 11ty output directory
	},
})
