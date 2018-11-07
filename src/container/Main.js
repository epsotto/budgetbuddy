import React, { Component, Fragment } from 'react'
import { Switch, Route, withRouter, Link } from 'react-router-dom'
import Income from '../organism/Income'
import Expense from '../organism/Expense'
import Loans from '../organism/Loans'
import Assets from '../organism/Assets'
import Home from './Home'
import Profile from '../organism/Profile'
import { Grid, Typography, List, ListItem } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
	root: {
		minHeight: '100vh',
		padding: '10px',
	},
	navStyles: {
		padding: '10px',
		color: theme.palette.primary[500],
	},
	navHeader: {
		marginBottom: '10px',
	},
	logoStyles: {
		textDecoration: 'none',
		color: 'inherit',
	},
})

class Main extends Component {
	state = {
		selectedIndex: 0,
	}
	constructor() {
		super()
		this.handleListItemClick = this.handleListItemClick.bind(this)
	}

	handleListItemClick = (event, index) => {
		this.setState({ selectedIndex: index })

		let newPath = ''
		if (index === 1) {
			newPath = '/income'
		} else if (index === 2) {
			newPath = '/expense'
		} else if (index === 3) {
			newPath = '/loans'
		} else if (index === 4) {
			newPath = '/assets'
		} else {
			newPath = '/'
		}
		this.props.history.push(newPath)
	}

	render() {
		const { classes } = this.props
		return (
			<Fragment>
				<Grid container className={classes.root} spacing={0}>
					<Grid item xs={2} className={classes.navStyles}>
						<Typography variant="headline" color="inherit" className={classes.navHeader}>
							<Link
								to="/"
								onClick={(event) => this.handleListItemClick(event, 0)}
								className={classes.logoStyles}
							>
								Budget Buddy
							</Link>
						</Typography>

						<List component="nav">
							<ListItem
								button
								selected={this.state.selectedIndex === 1}
								onClick={(event) => this.handleListItemClick(event, 1)}
							>
								Income
							</ListItem>
							<ListItem
								button
								selected={this.state.selectedIndex === 2}
								onClick={(event) => this.handleListItemClick(event, 2)}
							>
								Expense
							</ListItem>
							<ListItem
								button
								selected={this.state.selectedIndex === 3}
								onClick={(event) => this.handleListItemClick(event, 3)}
							>
								Loans and Liabilities
							</ListItem>
							<ListItem
								button
								selected={this.state.selectedIndex === 4}
								onClick={(event) => this.handleListItemClick(event, 4)}
							>
								Assets
							</ListItem>
						</List>
					</Grid>
					<Grid item xs={10} className={classes.widgetsContainer}>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/income" component={Income} />
							<Route exact path="/expense" component={Expense} />
							<Route exact path="/loans" component={Loans} />
							<Route exact path="/assets" component={Assets} />
							<Route exact path="/profile" component={Profile} />
						</Switch>
					</Grid>
				</Grid>
			</Fragment>
		)
	}
}

export default withRouter(withStyles(styles)(Main))
