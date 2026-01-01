/**
 * Eleventy Configuration for odd.horse
 *
 * This configuration sets up a static site generator with:
 * - Plain CSS and ES modules (no preprocessing)
 * - Image optimization with multiple formats
 * - Git integration for deployment info
 * - Custom filters and plugins
 */

// ===== IMPORTS =====
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import { DateTime } from 'luxon'
import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import simpleGit from 'simple-git'

// ===== GIT INTEGRATION =====
const git = simpleGit()

/**
 * Get current git branch and commit info for templates
 * Used to show deployment information and cache busting
 */
async function getGitInfo() {
	const branchSummary = await git.branch()
	const log = await git.log({ n: 1 })
	return {
		branch: branchSummary.current,
		commit: log.latest.hash,
		shortcommit: log.latest.hash.slice(0, 7),
	}
}

// ===== MAIN CONFIGURATION =====
/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	const gitInfo = await getGitInfo()

	// ===== SERVER & FILE HANDLING =====
	eleventyConfig.setServerPassthroughCopyBehavior('copy')

	/**
	 * Copy static assets to dist
	 * Fonts and images go to /assets/, artifacts to /artifacts/, manifest to root
	 */
	eleventyConfig.addPassthroughCopy('src/assets/fonts')
	eleventyConfig.addPassthroughCopy('src/assets/images')
	eleventyConfig.addPassthroughCopy({ 'src/artifacts': 'artifacts' })
	eleventyConfig.addPassthroughCopy({ 'src/site.webmanifest': 'site.webmanifest' })

	// ===== PLUGINS =====

	/**
	 * Image optimization plugin
	 * Automatically generates responsive image formats (WebP, JPEG) and sizes
	 * Images are lazy-loaded and decoded asynchronously for performance
	 */
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Output formats (SVG kept as-is, WebP for photos)
		formats: ['webp', 'svg', 'jpeg'],

		// Responsive image widths for mobile/tablet/desktop
		widths: [400, 800, 1200],

		// Output directory for optimized images
		outputDir: './dist/img/',
		urlPath: '/img/',

		// Default attributes for generated images
		htmlOptions: {
			imgAttributes: {
				loading: 'lazy', // Lazy load images below the fold
				decoding: 'async', // Async decoding for better performance
			},
			pictureAttributes: {},
		},

		// SVG optimization settings
		svgShortCircuit: true, // Don't generate raster formats for SVG inputs
		svgAllowUpscale: false, // Prevent SVG upscaling

		// Performance optimizations
		useCache: true, // Cache processed images to skip unchanged files
		hashLength: 10, // Shorter hashes for cleaner filenames
	})

	// ===== SHORTCODES & UTILITIES =====

	/**
	 * Year shortcode
	 * Returns current year for copyright notices
	 * Usage: {% year %} in templates
	 */
	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)

	// ===== MARKDOWN CONFIGURATION =====

	/**
	 * Markdown processor configuration
	 * Enables HTML in markdown, auto-linkification, and heading anchors
	 */
	const markdownLibrary = markdownIt({
		html: true, // Allow HTML tags in markdown
		breaks: true, // Convert line breaks to <br>
		linkify: true, // Auto-convert URLs to links
	}).use(markdownItAnchor, {
		// Add anchor links to headings for easy linking
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: 'after',
			class: 'direct-link',
			symbol: '#',
			level: [1, 2, 3, 4], // Add anchors to h1-h4
		}),
		slugify: eleventyConfig.getFilter('slug'),
	})
	eleventyConfig.setLibrary('md', markdownLibrary)

	// ===== LAYOUT ALIASES =====

	/**
	 * Layout alias for cleaner frontmatter
	 * Allows layout: "base" instead of layout: "_layouts/base.njk"
	 */
	eleventyConfig.addLayoutAlias('base', 'base.njk')

	// ===== GLOBAL DATA =====

	/**
	 * Default layout for all pages
	 * Can be overridden in frontmatter
	 */
	eleventyConfig.addGlobalData('layout', 'base')

	/**
	 * Git info (branch, commit) available to all templates
	 * Used for deployment info in footer and cache busting
	 */
	eleventyConfig.addGlobalData('gitInfo', gitInfo)

	// ===== DATE HANDLING =====

	/**
	 * Custom date parsing for frontmatter
	 * Allows dates in M/d/yyyy format (e.g., "12/31/2025")
	 */
	eleventyConfig.addDateParsing((dateValue) => {
		if (typeof dateValue === 'string') {
			return DateTime.fromFormat(dateValue, 'M/d/yyyy')
		}
	})

	// ===== ASSET HANDLING =====

	/**
	 * Direct asset copying without preprocessing
	 * CSS: Plain CSS, no SCSS compilation needed
	 * JS: ES modules loaded natively by browser
	 * Favicons: Copied as-is
	 */
	eleventyConfig.addPassthroughCopy('src/assets/css')
	eleventyConfig.addPassthroughCopy('src/assets/js')
	eleventyConfig.addPassthroughCopy('src/assets/favicon')

	/**
	 * Watch for changes in assets during development
	 * Triggers rebuild when CSS or JS files change
	 */
	eleventyConfig.addWatchTarget('src/assets/css/**/*.css')
	eleventyConfig.addWatchTarget('src/assets/js/**/*.js')

	// ===== PREPROCESSING =====

	/**
	 * Draft pages preprocessor
	 * Hides pages with draft: true from production builds
	 * Draft pages still visible during development
	 */
	eleventyConfig.addPreprocessor('drafts', '*', (data, _content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === 'build') {
			return false
		}
	})

	// ===== RETURN CONFIGURATION =====
	return {
		/**
		 * Template formats to process
		 * Markdown, Nunjucks, HTML, and Liquid templates
		 */
		templateFormats: ['md', 'njk', 'html', 'liquid'],

		/**
		 * Use Nunjucks for HTML templates
		 * Allows Nunjucks syntax in .html files
		 */
		htmlTemplateEngine: 'njk',

		/**
		 * Enable passthrough file copying
		 * Required for copying assets without processing
		 */
		passthroughFileCopy: true,

		/**
		 * Directory structure
		 * All source files in src/, output to dist/
		 */
		dir: {
			input: 'src',
			output: 'dist',
			includes: '_includes', // Reusable template components (header, footer, etc.)
			layouts: '_layouts', // Page layout templates (base, subpage, etc.)
			data: '_data', // Global data files (artifacts.json, links.json, etc.)
		},
	}
}