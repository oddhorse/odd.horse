/**
 * Eleventy Configuration for odd.horse
 *
 * Deliberately thin: 11ty here only renders templates, copies assets through,
 * and exposes a little global data. CSS and JS ship as-is, no build step.
 */

// ===== IMPORTS =====
import markdownIt from 'markdown-it'
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
	eleventyConfig.addPassthroughCopy('src/assets/audio')
	eleventyConfig.addPassthroughCopy({ 'src/artifacts': 'artifacts' })
	eleventyConfig.addPassthroughCopy({ 'src/site.webmanifest': 'site.webmanifest' })

	// ===== CUSTOM FILTERS =====

	/**
	 * Format a Date object as ISO 8601 string for sitemap <lastmod>
	 * Usage: {{ page.date | toISOString }}
	 * Example: 2025-12-17T00:00:00.000Z
	 */
	eleventyConfig.addFilter('toISOString', (date) => date.toISOString())

	// ===== MARKDOWN CONFIGURATION =====

	/**
	 * Markdown processor configuration
	 * Enables HTML in markdown and auto-linkification
	 */
	const markdownLibrary = markdownIt({
		html: true, // Allow HTML tags in markdown
		breaks: true, // Convert line breaks to <br>
		linkify: true, // Auto-convert URLs to links
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

	// ===== ASSET HANDLING =====

	/**
	 * Direct asset copying without preprocessing
	 * CSS: Plain CSS, no SCSS compilation needed
	 * JS: ES modules loaded natively by browser
	 * Favicons: Copied as-is
	 * Icons: SVG icons for social links
	 */
	eleventyConfig.addPassthroughCopy('src/assets/css')
	eleventyConfig.addPassthroughCopy('src/assets/js')
	eleventyConfig.addPassthroughCopy('src/assets/favicon')
	eleventyConfig.addPassthroughCopy('src/assets/icons')

	/**
	 * Watch for changes in assets during development
	 * Triggers rebuild when CSS or JS files change
	 */
	eleventyConfig.addWatchTarget('src/assets/css/**/*.css')
	eleventyConfig.addWatchTarget('src/assets/js/**/*.js')

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