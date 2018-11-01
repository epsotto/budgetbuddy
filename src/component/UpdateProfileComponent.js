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

const styles = (theme) => ({
	editLogoButton: {
		'&:hover': {
			color: theme.palette.primary[700],
			cursor: 'pointer',
		},
	},
})

class CustomDialogComponent extends Component {
	state = {
		open: false,
	}

	handleClickOpen = () => {
		this.setState({ open: true })
	}

	handleClose = () => {
		this.setState({ open: false })
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
						<TextField autoFocus margin="dense" id="firstName" label="First Name" type="text" fullWidth />
						<TextField
							autoFocus
							margin="dense"
							id="lastName"
							label="Last Name / Family Name / Surname"
							type="text"
							fullWidth
						/>
						<TextField
							autoFocus
							margin="dense"
							id="emailAddress"
							label="Email Address"
							type="email"
							fullWidth
						/>
						<TextField autoFocus margin="dense" id="address" label="Address" type="text" fullWidth />
						<TextField autoFocus margin="dense" id="zip" label="Zip Code" type="text" fullWidth />
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleClose} color="primary">
							Submit
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>
		)
	}
}

export default withStyles(styles)(CustomDialogComponent)
