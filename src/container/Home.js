import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import '../App.css'
import UpperWidget from '../organism/UpperWidget'
import HeaderButton from '../component/HeaderButtons'
import fire from '../config/Fire'

const db = fire.firestore('budgetbuddy')
const settings = { timestampsInSnapshots: true }
db.settings(settings)
const usersRef = db.collection('users')

const styles = (theme) => ({
	card: {
		padding: theme.spacing.unit * 2,
		backgroundColor: theme.palette.primary[500],
		color: theme.palette.secondary[50],
	},
	cardTitle: {
		color: theme.palette.secondary[50],
	},
	widgetsContainer: {
		padding: '10px',
		backgroundColor: theme.palette.primary[50],
		height: '100%',
	},
	headerPaper: {
		padding: theme.spacing.unit * 2,
		color: theme.palette.primary[500],
	},
	userTitle: {
		marginBottom: '20px',
	},
	userHeader: {
		borderBottom: '1px solid white',
		color: theme.palette.primary[500],
		height: '40px',
	},
	paper: {
		padding: theme.spacing.unit * 2,
		backgroundColor: '#ffffff',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
})

class Home extends Component {
	constructor() {
		super()
		this.state = { uName: '', uid: sessionStorage.getItem('user') }
	}

	componentDidMount() {
		if (this.state.uid) {
			usersRef.doc(this.state.uid).get().then((snapShot) => {
				if (snapShot.exists) {
					this.setState({ uName: snapShot.data().firstName })
				}
			})
		}
	}

	render() {
		const { classes } = this.props

		return (
			<Grid item xs={12} className={classes.widgetsContainer}>
				<Grid container className={classes.userTitle}>
					<Grid item xs={12}>
						<div className={classes.userHeader}>
							<Grid container>
								<Grid item xs={11}>
									{this.state.uName !== '' ? (
										<Typography variant="headline" color="inherit">
											Hello there, {this.state.uName}!
										</Typography>
									) : null}
								</Grid>
								<HeaderButton />
							</Grid>
						</div>
					</Grid>
				</Grid>

				<Grid container>
					<Grid item xs={12}>
						<UpperWidget />
					</Grid>
				</Grid>
			</Grid>
		)
	}
}

Home.propTypes = {
	classes: PropTypes.object.isRequired,
	uName: PropTypes.string,
	uid: PropTypes.string,
}

export default withStyles(styles)(Home)
