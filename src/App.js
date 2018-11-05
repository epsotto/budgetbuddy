import React, { Component } from 'react'
import './App.css'
import Main from './container/Main'
import Login from './molecule/LoginLanding'
import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import indigo from '@material-ui/core/colors/indigo'
import grey from '@material-ui/core/colors/grey'
import fire from './config/Fire'

const theme = createMuiTheme({
	palette: {
		primary: indigo,
		secondary: grey,
	},
})

class App extends Component {
	constructor() {
		super()

		let userInitial = sessionStorage.getItem('user')

		this.state = {
			user: userInitial !== null ? userInitial : null,
		}

		this.authListener = this.authListener.bind(this)
	}

	componentDidMount() {
		this.authListener()
	}

	authListener() {
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({ user })
				sessionStorage.setItem('user', user.uid)
			} else {
				this.setState({ user: null })
				sessionStorage.removeItem('user')
			}
		})
	}

	render() {
		return (
			<React.Fragment>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
					{/* <Main /> */}
					{this.state.user ? <Main /> : <Login />}
				</MuiThemeProvider>
			</React.Fragment>
		)
	}
}

export default App
