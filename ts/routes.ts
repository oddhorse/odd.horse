interface Route {
	paths: Array<string>
	title: string
	description: string
	id: string
}
interface Routes {
	[key: string]: Route
}
export const routes: Routes = {
	404: {
		paths: ['404.html'],
		title: '404',
		description: 'Page not found',
		id: '404',
	},
	'/': {
		paths: ['home.html'],
		title: 'home',
		description: 'This is the home page',
		id: 'home',
	},
	'/about': {
		paths: ['about.html'],
		title: 'About Us',
		description: 'This is the about page',
		id: 'about',
	},
	'/contact': {
		paths: ['contact.html'],
		title: 'Contact Us',
		description: 'This is the contact page',
		id: 'contact',
	},
}
