import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import { DateTime } from 'luxon'

import EleventyPluginNavigation from '@11ty/eleventy-navigation'
import EleventyPluginBundle from '@11ty/eleventy-plugin-bundle'
import EleventyPluginSyntaxhighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'

import pluginFilters from './src/_config/filters.js'

import rollupPluginCritical from 'rollup-plugin-critical'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
	eleventyConfig.setServerPassthroughCopyBehavior('copy')
	eleventyConfig.addPassthroughCopy('public')

	// Plugins
	eleventyConfig.addPlugin(EleventyPluginNavigation)
	eleventyConfig.addPlugin(EleventyPluginSyntaxhighlight)
	eleventyConfig.addPlugin(EleventyPluginBundle)
	eleventyConfig.addPlugin(pluginFilters)
	eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite', // Default name of the temp folder

		// Vite options (equal to vite.config.js inside project root)
		viteOptions: {
			publicDir: 'public',
			clearScreen: false,
			server: {
				mode: 'development',
				middlewareMode: true,
			},
			appType: 'custom',
			assetsInclude: ['**/*.xml', '**/*.txt'],
			build: {
				mode: 'production',
				sourcemap: 'true',
				manifest: true,
				// This puts CSS and JS in subfolders – remove if you want all of it to be in /assets instead
				rollupOptions: {
					input: 'src/assets/js/main.js',
					output: {
						assetFileNames: 'assets/css/main.[hash].css',
						chunkFileNames: 'assets/js/[name].[hash].js',
						entryFileNames: 'assets/js/[name].[hash].js',
					},
					plugins: [
						rollupPluginCritical({
							criticalUrl: './dist/',
							criticalBase: './dist/',
							criticalPages: [
								{ uri: 'index.html', template: 'index' },
								//TODO{ uri: 'posts/index.html', template: 'posts/index' },
								{ uri: '404.html', template: '404' },
							],
							criticalConfig: {
								inline: true,
								dimensions: [
									{
										height: 900,
										width: 375,
									},
									{
										height: 720,
										width: 1280,
									},
									{
										height: 1080,
										width: 1920,
									},
								],
								/* TODO
								penthouse: {
									forceInclude: [
										'.fonts-loaded-1 body',
										'.fonts-loaded-2 body',
									],
								},
								*/
							},
						}),
					],
				},
			},
		},
	})

	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)

	// Customize Markdown library and settings:
	const markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
	}).use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: 'after',
			class: 'direct-link',
			symbol: '#',
			level: [1, 2, 3, 4],
		}),
		slugify: eleventyConfig.getFilter('slug'),
	})
	eleventyConfig.setLibrary('md', markdownLibrary)

	// Layouts
	eleventyConfig.addLayoutAlias('base', 'base.njk')
	eleventyConfig.addLayoutAlias('subpage', 'subpage.njk')
	eleventyConfig.addLayoutAlias('music-release', 'music-release.njk')
	//TODOeleventyConfig.addLayoutAlias('post', 'post.njk')

	eleventyConfig.addGlobalData('layout', 'base')

	eleventyConfig.addDateParsing((dateValue) => {
		if (typeof dateValue === 'string') {
			return DateTime.fromFormat(dateValue, 'M/d/yyyy')
		}
	})

	// Copy/pass-through files
	eleventyConfig.addPassthroughCopy('src/assets/css')
	eleventyConfig.addPassthroughCopy('src/assets/js')

	eleventyConfig.addGlobalData('eleventyComputed', {
		parent: (data) => {
			const pathParts = data.page.filePathStem.split('/')
			return pathParts.length > 1 ? pathParts[1] : null
		},
		parentData: (data) => {
			return data.collections.all.find(
				(page) => page.filePathStem === `/${data.parent}`,
			)
		},
	})

	return {
		templateFormats: ['md', 'njk', 'html', 'liquid'],
		htmlTemplateEngine: 'njk',
		passthroughFileCopy: true,
		dir: {
			input: 'src',
			// better not use "public" as the name of the output folder (see above...)
			output: 'dist',
			includes: '_includes',
			layouts: '_layouts',
			data: '_data',
		},
	}
}
