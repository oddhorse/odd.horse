import { defineConfig } from 'vite'

export default defineConfig({
	root: 'dist', // Serve files from the 11ty output directory
	build: {
		outDir: 'dist',
		emptyOutDir: false, // Prevent clearing 11ty's output
	},
	server: {
		open: true, // Automatically open the browser
	},
})
