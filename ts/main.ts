/**
 * main.ts
 */

/*
TODO: configure auto-copyright profile and automatic source file header comments
 */

// import css files
import 'normalize.css'
import '../styles/style.css'

import './Router.ts'
import './rendering.ts'
import './home.ts'
import { render } from './rendering.ts'

render()

console.log('main.ts loaded')
