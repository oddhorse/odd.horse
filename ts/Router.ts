// Purpose: This file is the router for the website. It listens for clicks on the nav links and changes the content of the page based on the url path.

import { render } from './rendering'
import { routes } from './routes'
import { hideElementById, unhideElementById } from './utils'

/**
 * Router class for handling routing and page navigation.
 */
class Router {
	private static instance: Router
	private currentPage: string

	private constructor() {
		this.currentPage = 'home'
		this.initialize()
	}

	public static getInstance(): Router {
		if (!Router.instance) {
			Router.instance = new Router()
		}
		return Router.instance
	}

	public initialize(): void {
		// create document click that watches the nav links only
		document.addEventListener('click', (e) => {
			const { target } = e
			// if the target is not an html element or the target is not a nav link, return
			if (!(target instanceof HTMLElement) || !target.matches('nav a')) {
				return
			}
			e.preventDefault()
			const loc = (target as HTMLAnchorElement).href
			this.route(loc)
		})

		// add an event listener to the window that watches for url changes
		window.onpopstate = () => this.locationHandler()

		// call the locationHandler function to handle the initial url
		this.locationHandler()
	}

	/**
	 * Routes to the specified location.
	 *
	 * @param loc - The target location to route to.
	 */
	private route(loc: string): void {
		// window.history.pushState(state, unused, target link);
		window.history.pushState({}, '', loc)

		render()

		// call the locationHandler function to handle the new url
		this.locationHandler()
	}

	/**
	 * Handles the location change and updates the page accordingly.
	 *
	 * @remarks
	 * This method retrieves the current URL path and determines the corresponding route based on the path. It then hides the current page element and shows the new page element associated with the route. Additionally, it updates the document title and description based on the route information.
	 *
	 * @returns void
	 */
	public async locationHandler() {
		let location = window.location.pathname // Get the URL path
		// If the path length is 0, set it to the primary page route
		if (location.length === 0) {
			location = '/'
		}
		// Get the route object from the routes object
		const route = routes[location] || routes['404']

		/*
        // get the html from the template
        let html = '';
        for (const path of route.paths) {
            html += await fetch(path).then((response) => response.text());
        }
        // set the content of the content div to the html
        const contentArea = document.getElementById("content")
        if (!contentArea) throw Error('Content area not found');

        contentArea.innerHTML = html;
        */

		// Hide the current page element
		hideElementById(this.currentPage)

		console.log('Current page:', this.currentPage)

		// Show the new page element
		unhideElementById(route.id)

		// Update the current page
		this.currentPage = route.id

		console.log('Current page:', this.currentPage)

		// Set the title of the document to the title of the route
		document.title = route.title
		// Set the description of the document to the description of the route
		document
			.querySelector('meta[name="description"]')
			?.setAttribute('content', route.description)
	}
}

export const router = Router.getInstance()
