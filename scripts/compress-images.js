#!/usr/bin/env node

/**
 * compress-images.js
 *
 * Makes images look like shit - small, crusty, JPEG artifacts galore
 * Uses nearest-neighbor resizing for that chunky pixelated aesthetic
 *
 * Usage:
 *   node scripts/compress-images.js <folder-path> [options]
 *
 * Options:
 *   --width <pixels>     Max width (default: 200)
 *   --quality <0-100>    JPEG quality (default: 40)
 *   --output <folder>    Output folder (default: <input>-compressed)
 *
 * Examples:
 *   node scripts/compress-images.js ./images
 *   node scripts/compress-images.js ./photos --width 150 --quality 30
 *   node scripts/compress-images.js ./pics --output ./crusty
 */

import sharp from 'sharp'
import { readdir, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { existsSync } from 'fs'

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
	console.log(`
Usage: node scripts/compress-images.js <folder-path> [options]

Makes images small and crusty with nearest-neighbor resizing.

Options:
  --width <pixels>     Max width (default: 200)
  --quality <0-100>    JPEG quality (default: 40)
  --output <folder>    Output folder (default: <input>-compressed)

Examples:
  node scripts/compress-images.js ./images
  node scripts/compress-images.js ./photos --width 150 --quality 30
  node scripts/compress-images.js ./pics --output ./crusty
`)
	process.exit(0)
}

const inputFolder = args[0]
let maxWidth = 200
let quality = 40
let outputFolder = null

// Parse options
for (let i = 1; i < args.length; i++) {
	if (args[i] === '--width' && args[i + 1]) {
		maxWidth = parseInt(args[i + 1])
		i++
	} else if (args[i] === '--quality' && args[i + 1]) {
		quality = parseInt(args[i + 1])
		i++
	} else if (args[i] === '--output' && args[i + 1]) {
		outputFolder = args[i + 1]
		i++
	}
}

// Default output folder: input folder + "-compressed"
if (!outputFolder) {
	outputFolder = `${inputFolder}-compressed`
}

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.tif']

/**
 * Compress a single image - make it small and crusty
 *
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to save compressed image
 */
async function compressImage(inputPath, outputPath) {
	try {
		await sharp(inputPath)
			.resize(maxWidth, null, {
				// Nearest-neighbor = chunky pixelated look (no smoothing)
				kernel: 'nearest',
				// Shrink only, don't enlarge small images
				withoutEnlargement: true,
			})
			.jpeg({
				// Low quality = crusty JPEG artifacts
				quality: quality,
				// Disable progressive for extra crustiness
				progressive: false,
			})
			.toFile(outputPath)

		console.log(`✓ ${basename(inputPath)} → ${basename(outputPath)}`)
	} catch (err) {
		console.error(`✗ Failed to compress ${basename(inputPath)}:`, err.message)
	}
}

/**
 * Process all images in a folder
 */
async function compressFolder(inputFolder, outputFolder) {
	// Check if input folder exists
	if (!existsSync(inputFolder)) {
		console.error(`Error: Folder "${inputFolder}" does not exist`)
		process.exit(1)
	}

	// Create output folder if it doesn't exist
	if (!existsSync(outputFolder)) {
		await mkdir(outputFolder, { recursive: true })
		console.log(`Created output folder: ${outputFolder}`)
	}

	// Read all files in input folder
	const files = await readdir(inputFolder)

	// Filter for image files
	const imageFiles = files.filter(file => {
		const ext = extname(file).toLowerCase()
		return imageExtensions.includes(ext)
	})

	if (imageFiles.length === 0) {
		console.log(`No images found in ${inputFolder}`)
		process.exit(0)
	}

	console.log(`\nFound ${imageFiles.length} images to compress`)
	console.log(`Settings: ${maxWidth}px wide, ${quality}% quality, nearest-neighbor resizing`)
	console.log(`Output: ${outputFolder}\n`)

	// Process each image
	for (const file of imageFiles) {
		const inputPath = join(inputFolder, file)
		// Always output as .jpg
		const outputFilename = basename(file, extname(file)) + '.jpg'
		const outputPath = join(outputFolder, outputFilename)

		await compressImage(inputPath, outputPath)
	}

	console.log(`\n✨ Done! ${imageFiles.length} images compressed to ${outputFolder}`)
}

// Run the script
compressFolder(inputFolder, outputFolder)
