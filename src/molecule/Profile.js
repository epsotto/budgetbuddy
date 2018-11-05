import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography, TextField, CircularProgress } from '@material-ui/core'
import '../App.css'
import AccountLogo from '../baseline-account_circle-24px.svg'
import UpdateProfileComponent from '../component/UpdateProfileComponent'
import HeaderButton from '../component/HeaderButtons'
import fire from '../config/Fire'
import moment from 'moment'

const db = fire.firestore('budgetbuddy')
const settings = { timestampsInSnapshots: true }
db.settings(settings)
const userRef = db.collection('users')

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
	textfield: {
		width: '100%',
		marginBottom: theme.spacing.unit * 3,
		fontSize: '30px',
	},
	textfieldShort: {
		marginBottom: theme.spacing.unit * 3,
	},
	fieldContainer: {
		backgroundColor: '#ffffff',
		padding: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit,
	},
	profileImageContainer: {
		width: '100%',
	},
	profilePicture: {
		width: '100%',
	},
	profileTextAlign: {
		textAlign: 'center',
	},
	updateProfilePicture: {
		textAlign: 'center',
	},
	updateProfilePictureButton: {
		textDecoration: 'none',
		color: theme.palette.primary[700],
		'&:hover': {
			textDecoration: 'underline',
		},
	},
})

class Profile extends Component {
	constructor() {
		super()

		this.state = {
			isReadOnly: true,
			loader: true,
			uid: sessionStorage.getItem('user'),
			profile: {
				firstName: '',
				lastName: '',
				email: '',
				address: '',
				zip: '',
			},
		}

		this.handleProfileChange = this.handleProfileChange.bind(this)
	}

	componentDidMount() {
		if (this.state.uid !== null) {
			userRef.doc(this.state.uid).get().then((docRef) => {
				if (docRef.exists) {
					this.setState({
						profile: {
							firstName: docRef.data().firstName,
							lastName: docRef.data().lastName,
							email: docRef.data().email,
							address: docRef.data().address,
							zip: docRef.data().zip,
						},
						loader: false,
					})
				}
			})
		} else {
			setTimeout(function(){
				window.location.reload(true)
			}, 1000)
		}
	}

	handleProfileChange = (data) => {
		console.log(data)

		userRef.doc(this.state.uid).get().then((docRef) => {
			console.log(docRef)
			if (docRef.exists) {
			docRef.ref
				.update({
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					address: data.address,
					zip: data.zip,
					updateDttm: moment(moment(), 'DD/MM/YYYY').valueOf(),
				})
				.then(() => {
					this.setState({
						profile: {
							firstName: data.firstName,
							lastName: data.lastName,
							email: data.email,
							address: data.address,
							zip: data.zip,
						},
					})
				})

				// if (this.state.email !== data.email.toLowerCase()) {
				// 	let provider = fire.auth()
				// 	let currentUser = fire.auth().currentUser
				// 	currentUser
				// 		.updateEmail(data.email)
				// 		.then(() => {
				// 			console.log('email updated')
				// 		})
				// 		.catch((error) => {
				// 			console.log(error)
				// 		})
				// }
			} else {
				console.log('Document does not exist.')
			}
		})
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
									<Typography variant="headline" color="inherit">
										Profile
									</Typography>
								</Grid>
								<HeaderButton />
							</Grid>
						</div>
					</Grid>
				</Grid>

				<Grid container>
					<Grid item xs={12}>
						<Grid container>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Grid container>
									<Grid item xs={12} className={classes.profileTextAlign}>
										<div className={classes.profileImageContainer}>
											<img
												src={AccountLogo}
												className={classes.profilePicture}
												alt="Profile picture"
											/>
										</div>
									</Grid>
									<Grid item xs={12} className={classes.updateProfilePicture}>
										<Typography variant="body1">
											<a
												href="#"
												aria-labelledby="Click to update profile picture."
												className={classes.updateProfilePictureButton}
											>
												Update
											</a>
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={5} className={classes.fieldContainer}>
								{this.state.loader ? (
									<CircularProgress />
								) : (
									<Grid container>
										<UpdateProfileComponent
											userProfile={this.state.profile}
											onEdit={this.handleProfileChange}
										/>
										<Grid item xs={12}>
											<TextField
												className={classes.textfield}
												id="firstName"
												label="First Name"
												value={this.state.profile.firstName}
												readOnly={this.state.isReadOnly}
											/>
											<TextField
												className={classes.textfield}
												id="lastName"
												label="Family Name / Surname / Last Name"
												value={this.state.profile.lastName}
												readOnly={this.state.isReadOnly}
												type="text"
											/>
											<TextField
												className={classes.textfield}
												id="email"
												label="Email Address"
												value={this.state.profile.email}
												readOnly={this.state.isReadOnly}
												type="text"
												InputLabelProps={{ shrink: true }}
											/>
											<TextField
												className={classes.textfield}
												id="address"
												label="Address"
												value={this.state.profile.address}
												readOnly={this.state.isReadOnly}
												type="text"
											/>
											<TextField
												className={classes.textfieldShort}
												id="zip"
												label="Zip Code"
												value={this.state.profile.zip}
												readOnly={this.state.isReadOnly}
												type="text"
											/>
										</Grid>
									</Grid>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		)
	}
}

Profile.propTypes = {
	classes: PropTypes.object.isRequired,
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	email: PropTypes.string,
	address: PropTypes.string,
	zip: PropTypes.string,
	isReadOnly: PropTypes.bool,
	uid: PropTypes.string,
}

export default withStyles(styles)(Profile)
