interface Route {
	path: string
	title: string
	description: string
	id: string
}
interface Routes {
	[key: string]: Route
}
export const routes: Routes = {
	404: {
		path: '404.html',
		title: 'oddhorse 404',
		description: 'page not found',
		id: '404',
	},
	'/': {
		path: 'home.html',
		title: 'oddhorse',
		description: 'oddhorse is him!',
		id: 'home',
	},
	'/music': {
		path: 'music.html',
		title: 'oddhorse music',
		description: 'this shit is crazy!',
		id: 'music',
	},
	'/about': {
		path: 'about.html',
		title: "who's oddhorse?",
		description: 'find out more here...',
		id: 'about',
	},
	'/contact': {
		path: 'contact.html',
		title: 'Contact Us',
		description: 'hit me up or whateva',
		id: 'contact',
	},
}
