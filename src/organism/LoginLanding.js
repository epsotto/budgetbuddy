import React, { Component, Fragment } from 'react'
import fire from '../config/Fire'
import userPreference from '../config/DefaultUserPreference'
import moment from 'moment'
import { Grid, Paper, TextField, Button, FormControl, FormLabel, FormGroup, Typography } from '@material-ui/core'
import { Copyright, MonetizationOn } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const db = fire.firestore('budgetbuddy')
const settings = { timestampsInSnapshots: true }
db.settings(settings)

const styles = (theme) => ({
	root: {
		padding: theme.spacing.unit * 4,
		backgroundColor: theme.palette.primary[700],
		color: theme.palette.secondary[50],
	},
	paper: {
		padding: theme.spacing.unit * 3,
	},
	loginForm: {
		padding: theme.spacing.unit * 3,
	},
	errorMessage: {
		color: 'red',
		fontSize: '10px',
	},
	button: {
		backgroundColor: theme.palette.primary[700],
		color: theme.palette.secondary[50],
		marginTop: '10px',
		'&:hover': {
			color: theme.palette.primary[700],
		},
	},
	footer: {
		textAlign: 'center',
		marginTop: theme.spacing.unit * 14,
		color: theme.palette.primary[700],
		fontSize: '12px',
	},
	icon: {
		fontSize: '12px',
	},
	logo: {
		fontSize: '200px',
	},
	logoContainer: {
		overflow: 'hidden',
		maxHeight: '236px',
		textAlign: 'center',
	},
	formHeader: {
		color: theme.palette.primary[700],
		fontSize: '24px',
		textAlign: 'center',
	},
})

class LoginLanding extends Component {
	constructor(props) {
		super(props)
		this.login = this.login.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.signup = this.signup.bind(this)
		this.state = {
			loginEmail: '',
			signUpEmail: '',
			loginPassword: '',
			signUpPassword: '',
			retypePassword: '',
			firstName: '',
			lastName: '',
			address: '',
			zip: '',
			userPreference: [],
			isLoginError: false,
			isSignupError: false,
		}
	}

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	handleRetypePassword = (e) => {
		let error = false
		if (this.state.signUpPassword !== e.target.value) {
			error = true
		}

		this.setState({
			[e.target.name]: e.target.value,
			isRetypeError: error,
		})
	}

	login(e) {
		e.preventDefault()

		if (this.state.loginEmail !== '' && this.state.loginPassword !== '') {
			fire
				.auth()
				.signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword)
				.then((u) => {})
				.catch((error) => {
					this.setState({ isLoginError: true })
					console.log(error)
				})
		} else {
			this.setState({ isLoginError: true })
		}
	}

	signup(e) {
		e.preventDefault()

		if (
			this.state.firstName !== '' &&
			this.state.lastName !== '' &&
			this.state.signUpEmail !== '' &&
			this.state.signUpPassword !== '' &&
			this.state.retypePassword !== '' &&
			this.state.address !== '' &&
			this.state.zip !== '' &&
			!this.state.isRetypeError
		) {
			fire
				.auth()
				.createUserWithEmailAndPassword(this.state.email2, this.state.password2)
				.then((u) => {})
				.then((u) => {
					let user = fire.auth().currentUser
					if (user != null) {
						let user = fire.auth().currentUser
						if (user != null) {
							db
								.collection('users')
								.doc(user.uid)
								.set({
									firstName: this.state.firstName,
									lastName: this.state.lastName,
									address: this.state.address,
									zip: this.state.zip,
									email: this.state.email2,
									userPreference: userPreference,
									createDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
									updateDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
									uid: user.uid,
								})
								.catch(function(error){
									throw new Error('Error adding document: ', error)
								})
						}
					}
				})
				.catch((error) => {
					console.log(error)
					this.setState({ isSignupError: true })
				})
		} else {
			this.setState({ isSignupError: true })
		}
	}
	render() {
		const { classes } = this.props
		return (
			<Fragment>
				<Grid container className={classes.root} alignItems="center" justify="center">
					<Grid item xs={12}>
						<Grid container spacing={8} direction="row" alignItems="center" justify="center">
							<Grid item xs={4}>
								<Grid container alignItems="center" justify="center">
									<Grid item xs={12} className={classes.logoContainer}>
										<MonetizationOn color="inherit" className={classes.logo} />
										<Typography variant="headline" color="inherit">
											Budget Buddy!
										</Typography>
									</Grid>
								</Grid>
								<Grid container>
									<Grid item xs={12}>
										<Paper className={classes.paper} square={true}>
											<FormControl component="fieldset" className={classes.loginForm} fullWidth>
												<FormLabel
													component="legend"
													className={classes.formHeader}
													color="inherit"
												>
													Login
												</FormLabel>
												{this.state.isLoginError ? (
													<span className={classes.errorMessage}>
														Incorrect email/password. Please try again.
													</span>
												) : null}
												<FormGroup>
													<TextField
														id="loginEmail"
														name="loginEmail"
														label="Email"
														type="email"
														value={this.state.loginEmail}
														onChange={this.handleChange}
														fullWidth
														error={this.state.isLoginError}
														required
													/>
													<TextField
														id="loginPassword"
														name="loginPassword"
														label="Password"
														type="password"
														value={this.state.loginPassword}
														onChange={this.handleChange}
														fullWidth
														error={this.state.isLoginError}
														required
													/>

													<Button
														type="submit"
														onClick={this.login}
														className={classes.button}
													>
														Login
													</Button>
												</FormGroup>
											</FormControl>
										</Paper>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={4}>
								<Paper className={classes.paper} square={true}>
									<FormControl component="fieldset" className={classes.loginForm} fullWidth>
										<FormLabel component="legend" className={classes.formHeader} color="inherit">
											Sign Up
										</FormLabel>
										{this.state.isSignupError ? (
											<span className={classes.errorMessage}>Please revisit errors in form.</span>
										) : null}
										<FormGroup>
											<TextField
												id="firstName"
												name="firstName"
												label="First name"
												type="text"
												value={this.state.firstName}
												onChange={this.handleChange}
												fullWidth
												error={this.state.isSignupError}
												required
											/>

											<TextField
												id="lastName"
												name="lastName"
												label="Last name"
												type="text"
												value={this.state.lastName}
												onChange={this.handleChange}
												fullWidth
												error={this.state.isSignupError}
												required
											/>

											<TextField
												id="signUpEmail"
												name="signUpEmail"
												label="Email"
												type="email"
												value={this.state.signUpEmail}
												onChange={this.handleChange}
												fullWidth
												error={this.state.isSignupError}
												required
											/>

											<TextField
												id="signUpPassword"
												name="signUpPassword"
												label="Enter password"
												type="password"
												value={this.state.signUpPassword}
												onChange={this.handleChange}
												fullWidth
												error={this.state.isSignupError}
												required
											/>

											<TextField
												id="retypePassword"
												name="retypePassword"
												label="Retype password"
												type="password"
												value={this.state.retypePassword}
												onChange={this.handleRetypePassword}
												fullWidth
												error={this.state.isRetypeError || this.state.isSignupError}
												required
											/>

											<TextField
												id="address"
												name="address"
												label="Address"
												type="text"
												value={this.state.address}
												onChange={this.handleChange}
												fullWidth
												error={this.state.isSignupError}
												required
											/>

											<TextField
												id="zip"
												name="zip"
												label="Zip"
												type="text"
												value={this.state.zip}
												onChange={this.handleChange}
												fullWidth
												error={this.state.isSignupError}
												required
											/>

											<Button onClick={this.signup} type="submit" className={classes.button}>
												Signup
											</Button>
										</FormGroup>
									</FormControl>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid container direction="row" alignItems="center" justify="center" className={classes.footer}>
					<Grid item xs={12}>
						<Grid container>
							<Grid item xs={12}>
								<Typography variant="body1" color="inherit">
									<Copyright className={classes.icon} /> All rights reserved 2018.
								</Typography>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item xs={12}>
								<Typography variant="body1" color="inherit">
									Site Map | About Us | Home
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Fragment>
		)
	}
}

LoginLanding.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LoginLanding)
