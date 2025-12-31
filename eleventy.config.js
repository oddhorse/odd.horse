/**
 * Eleventy Configuration for odd.horse
 * 
 * This configuration sets up a static site generator with:
 * - Vite integration for modern asset processing
 * - Image optimization with multiple formats
 * - Critical CSS extraction for performance
 * - Git integration for deployment info
 * - Custom filters and plugins
 */

// ===== IMPORTS =====
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import EleventyPluginNavigation from '@11ty/eleventy-navigation'
import EleventyPluginBundle from '@11ty/eleventy-plugin-bundle'
import EleventyPluginSyntaxhighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'
import { DateTime } from 'luxon'
import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import rollupPluginCritical from 'rollup-plugin-critical'
import simpleGit from 'simple-git'

import pluginFilters from './src/_config/filters.js'

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
	eleventyConfig.addPassthroughCopy('public')

	// ===== PLUGINS =====
	
	// Navigation plugin for hierarchical site navigation
	eleventyConfig.addPlugin(EleventyPluginNavigation)
	
	// Syntax highlighting for code blocks
	eleventyConfig.addPlugin(EleventyPluginSyntaxhighlight)
	
	// Bundle plugin for inline CSS/JS
	eleventyConfig.addPlugin(EleventyPluginBundle)
	
	// Custom filters (date formatting, utilities, etc.)
	eleventyConfig.addPlugin(pluginFilters)
	
	// Image optimization plugin - generates multiple formats and sizes
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Output formats (SVG kept for actual SVG files, optimized for performance)
		formats: ['webp', 'svg', 'jpeg'], // Removed AVIF (slower to generate, smaller benefit)
		
		// Reduced responsive image widths for faster processing
		widths: [400, 800, 1200], // Reduced from 4 sizes to 3
		
		// Output directory for organized file structure
		outputDir: './dist/img/',
		urlPath: '/img/',
		
		// Default attributes for generated images
		htmlOptions: {
			imgAttributes: {
				loading: 'lazy',     // Changed to lazy loading for better performance
				decoding: 'async',   // Async image decoding for performance
			},
			pictureAttributes: {},
		},
		
		// SVG optimization settings
		svgShortCircuit: true,      // Skip raster formats for SVG inputs
		svgAllowUpscale: false,     // Prevent SVG upscaling
		
		// Performance optimizations
		useCache: true,             // Enable caching to skip unchanged files
		hashLength: 10,             // Shorter hashes for cleaner filenames
	})
	
	// Vite integration for modern asset processing
	eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite',
		
		viteOptions: {
			publicDir: 'public',
			clearScreen: false,
			
			// Development server configuration
			server: {
				mode: 'development',
				middlewareMode: true,
			},
			
			appType: 'custom',
			assetsInclude: ['**/*.xml', '**/*.txt'],
			
			// Production build configuration
			build: {
				mode: 'production',
				sourcemap: 'true',
				manifest: true,
				
				rollupOptions: {
					// Entry point for JavaScript bundling
					input: 'src/assets/js/main.js',
					
					// Output file naming with cache-busting hashes
					output: {
						assetFileNames: 'assets/css/main.[hash].css',
						chunkFileNames: 'assets/js/[name].[hash].js',
						entryFileNames: 'assets/js/[name].[hash].js',
					},
					
					plugins: [
						// Critical CSS extraction for performance
						rollupPluginCritical({
							criticalUrl: './dist/',
							criticalBase: './dist/',
							
							// Pages to extract critical CSS from
							criticalPages: [
								{ uri: 'index.html', template: 'index' },
								{ uri: 'links/index.html', template: 'links' },
								{ uri: 'shop/index.html', template: 'shop' },
								{ uri: 'contact/index.html', template: 'contact' },
								{ uri: '404.html', template: '404' },
							],
							
							criticalConfig: {
								inline: true, // Inline critical CSS directly in HTML
								
								// Screen dimensions for critical CSS extraction
								dimensions: [
									{ height: 900, width: 375 },   // Mobile
									{ height: 720, width: 1280 },  // Tablet
									{ height: 1080, width: 1920 }, // Desktop
								],
								
								// TODO: Consider enabling penthouse font optimization
								// penthouse: {
								//	forceInclude: [
								//		'.fonts-loaded-1 body',
								//		'.fonts-loaded-2 body',
								//	],
								// },
							},
						}),
					],
				},
			},
		},
	})

	// ===== SHORTCODES & UTILITIES =====
	
	// Simple shortcode to get current year
	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)

	// ===== MARKDOWN CONFIGURATION =====
	const markdownLibrary = markdownIt({
		html: true,     // Allow HTML tags in markdown
		breaks: true,   // Convert line breaks to <br>
		linkify: true,  // Auto-convert URLs to links
	}).use(markdownItAnchor, {
		// Add anchor links to headings
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
	eleventyConfig.addLayoutAlias('base', 'base.njk')
	eleventyConfig.addLayoutAlias('subpage', 'subpage.njk')
	eleventyConfig.addLayoutAlias('music-release', 'music-release.njk')
	// TODO: Add post layout when blog system is complete
	// eleventyConfig.addLayoutAlias('post', 'post.njk')

	// ===== GLOBAL DATA =====
	
	// Default layout for all pages
	eleventyConfig.addGlobalData('layout', 'base')
	
	// Make git info available to all templates
	eleventyConfig.addGlobalData('gitInfo', gitInfo)

	// ===== DATE HANDLING =====
	
	// Custom date parsing for frontmatter dates in M/d/yyyy format
	eleventyConfig.addDateParsing((dateValue) => {
		if (typeof dateValue === 'string') {
			return DateTime.fromFormat(dateValue, 'M/d/yyyy')
		}
	})

	// ===== ASSET PASSTHROUGH =====
	
	// Copy assets directly without processing
	eleventyConfig.addPassthroughCopy('src/assets/css')
	eleventyConfig.addPassthroughCopy('src/assets/js')
	eleventyConfig.addPassthroughCopy('src/assets/favicon')

	// ===== COMPUTED DATA =====
	
	// Auto-compute parent page relationships for navigation
	eleventyConfig.addGlobalData('eleventyComputed', {
		// Get parent directory name from file path
		parent: (data) => {
			const pathParts = data.page.filePathStem.split('/')
			return pathParts.length > 1 ? pathParts[1] : null
		},
		
		// Find parent page data for breadcrumbs/navigation
		parentData: (data) => {
			return data.collections.all.find(
				(page) => page.filePathStem === `/${data.parent}`,
			)
		},
	})

	// ===== PREPROCESSING =====
	
	// Hide draft pages in production builds
	eleventyConfig.addPreprocessor('drafts', '*', (data, _content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === 'build') {
			return false
		}
	})

	// ===== RETURN CONFIGURATION =====
	return {
		// Template formats to process
		templateFormats: ['md', 'njk', 'html', 'liquid'],
		
		// Use Nunjucks for HTML templates
		htmlTemplateEngine: 'njk',
		
		// Enable passthrough file copying
		passthroughFileCopy: true,
		
		// Directory structure
		dir: {
			input: 'src',
			output: 'dist',
			includes: '_includes',  // Reusable template components
			layouts: '_layouts',    // Page layout templates
			data: '_data',          // Global data files
		},
	}
}