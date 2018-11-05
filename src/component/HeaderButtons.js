import React, { Component } from 'react'
import { Typography, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
import fire from '../config/Fire'
import '../App.css'

class HeaderButton extends Component {
	constructor() {
		super()

		this.logoutAction = (event) => {
			event.stopPropagation()
			fire.auth().signOut()
		}
	}

	render() {
		return (
			<Grid item xs={1} className="headerLinks">
				<Typography variant="body1" color="inherit" className="headerLinkStyles">
					<Link to={{ pathname: '/profile' }} id="profile">
						Profile
					</Link>&nbsp;|&nbsp;
					<Link to="" id="logout" onClick={this.logoutAction}>
						Logout
					</Link>
				</Typography>
			</Grid>
		)
	}
}

export default HeaderButton
