import React, { Component } from 'react'
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import EditLogo from '@material-ui/icons/Edit'
import PropTypes from 'prop-types'

const styles = (theme) => ({
	editLogoButton: {
		'&:hover': {
			color: theme.palette.primary[700],
			cursor: 'pointer',
		},
	},
})

class UpdateProfileCompoent extends Component {
	constructor() {
		super()
		this.state = {
			open: false,
			firstName: '',
			lastName: '',
			email: '',
			address: '',
			zip: '',
		}

		this.handleInputChange = this.handleInputChange.bind(this)
	}

	componentDidMount() {
		const { userProfile } = this.props

		if (userProfile) {
			this.setState({
				firstName: userProfile.firstName,
				lastName: userProfile.lastName,
				email: userProfile.email,
				address: userProfile.address,
				zip: userProfile.zip,
			})
		}
	}

	handleClickOpen = () => {
		this.setState({ open: true })
	}

	handleClose = () => {
		this.setState({ open: false })
	}

	handleInputChange = (event) => {
		if (event.target) {
			const target = event.target
			const value = target.value
			const name = target.id ? target.id : target.name

			this.setState({
				[name]: value,
			})
		}
	}

	submitForm = () => {
		this.setState({ open: false })

		const { onEdit } = this.props

		if (onEdit) {
			onEdit({
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				email: this.state.email,
				address: this.state.address,
				zip: this.state.zip,
			})
		}
	}

	render() {
		const { classes } = this.props

		return (
			<Grid container>
				<Grid item xs={12}>
					<Typography align="right">
						<EditLogo
							className={classes.editLogoButton}
							aria-labelledby="Click here to edit your profile."
							onClick={this.handleClickOpen}
						/>
					</Typography>
				</Grid>

				<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Update your profile</DialogTitle>
					<DialogContent>
						<DialogContentText>Fill out the form to update your profile.</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="firstName"
							name="firstName"
							label="First Name"
							type="text"
							fullWidth
							value={this.state.firstName}
							onChange={this.handleInputChange}
						/>
						<TextField
							margin="dense"
							id="lastName"
							name="lastName"
							label="Last Name / Family Name / Surname"
							type="text"
							fullWidth
							value={this.state.lastName}
							onChange={this.handleInputChange}
						/>
						<TextField
							margin="dense"
							id="email"
							name="email"
							label="Email Address"
							type="email"
							fullWidth
							value={this.state.email}
							onChange={this.handleInputChange}
						/>
						<TextField
							margin="dense"
							id="address"
							name="address"
							label="Address"
							type="text"
							fullWidth
							value={this.state.address}
							onChange={this.handleInputChange}
						/>
						<TextField
							margin="dense"
							id="zip"
							name="zip"
							label="Zip Code"
							type="text"
							fullWidth
							value={this.state.zip}
							onChange={this.handleInputChange}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.submitForm} color="primary">
							Submit
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>
		)
	}
}

UpdateProfileCompoent.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool,
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	email: PropTypes.string,
	address: PropTypes.string,
	zip: PropTypes.string,
	handleClickOpen: PropTypes.func,
	handleClose: PropTypes.func,
	handleInputChange: PropTypes.func,
}

export default withStyles(styles)(UpdateProfileCompoent)
