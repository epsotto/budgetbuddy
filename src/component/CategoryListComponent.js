import React, { Component } from 'react'
import {
	Grid,
	List,
	ListItem,
	ListItemText,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Button,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

const styles = (theme) => ({
	root: {
		width: '100%',
		padding: theme.spacing.unit * 2,
		backgroundColor: '#ffffff',
	},
	headerStyles: {
		backgroundColor: theme.palette.primary[700],
		color: theme.palette.secondary[50],
		padding: theme.spacing.unit * 2,
	},
	listStyles: {
		maxHeight: '305px',
		overflow: 'auto',
	},
	listItem: {
		borderBottom: '1px solid #cfcfcf',
		padding: theme.spacing.unit * 2,
	},
	deleteButton: {
		color: red[700],
	},
})

class CategoryListComponent extends Component {
	constructor() {
		super()

		this.state = {
			open: false,
			confirm: false,
			isDelete: false,
			newCategoryName: '',
			oldCategoryName: '',
		}
	}

	handleToggle = (value) => () => {
		if (value) {
			this.setState({
				open: true,
				newCategoryName: value,
				oldCategoryName: value,
			})
		}
	}

	handleClose = () => {
		this.setState({ open: false })
	}

	handleDelete = () => {
		this.setState({
			confirm: true,
		})
	}

	handleConfirmClose = () => {
		this.setState({ confirm: false })
	}

	handleConfirmed = () => {
		const { onModifyCategoryList } = this.props
		this.setState({
			open: false,
			confirm: false,
		})

		if (onModifyCategoryList) {
			onModifyCategoryList({
				isDelete: true,
				newCategoryName: this.state.newCategoryName,
				oldCategoryName: this.state.oldCategoryName,
			})
		}
	}

	handleInputChange = (event) => {
		if (event.target) {
			const target = event.target
			const value = target.value
			const name = target.id

			this.setState({
				[name]: value,
			})
		}
	}

	handleUpdate = () => {
		const { onModifyCategoryList } = this.props
		this.setState({
			open: false,
			confirm: false,
		})

		if (onModifyCategoryList) {
			onModifyCategoryList({
				isDelete: false,
				newCategoryName: this.state.newCategoryName,
				oldCategoryName: this.state.oldCategoryName,
			})
		}
	}

	render() {
		const { classes, categoryList } = this.props
		return (
			<div className={classes.root}>
				<Grid container>
					<Grid item xs={12} className={classes.headerStyles}>
						<Typography color="inherit" variant="subheading">
							Categories
						</Typography>
					</Grid>
				</Grid>
				<List disablePadding className={classes.listStyles}>
					{categoryList.map((value) => (
						<ListItem
							key={value}
							role={undefined}
							dense
							button
							onClick={this.handleToggle(value)}
							className={classes.listItem}
						>
							<ListItemText primary={value} />
						</ListItem>
					))}
				</List>

				<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="Update category item">
					<DialogTitle id="form-dialog-title">Update Category Item</DialogTitle>
					<DialogContent>
						<DialogContentText>Update the new value for the selected category.</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="newCategoryName"
							label="Category Name"
							fullWidth
							required
							value={this.state.newCategoryName}
							onChange={this.handleInputChange}
						/>
					</DialogContent>

					<DialogActions>
						<Button onClick={this.handleDelete} className={classes.deleteButton}>
							Delete
						</Button>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleUpdate} color="primary">
							Update
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={this.state.confirm} onClose={this.handleConfirmClose} aria-labelledby="Confirm delete">
					<DialogTitle>Confirm Delete</DialogTitle>
					<DialogContent>
						<DialogContentText>Are you sure you want to delete this item?</DialogContentText>
					</DialogContent>
					<Button onClick={this.handleConfirmClose} color="primary">
						No
					</Button>
					<Button onClick={this.handleConfirmed} color="primary">
						Yes
					</Button>
				</Dialog>
			</div>
		)
	}
}

CategoryListComponent.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool,
	confirm: PropTypes.bool,
	isDelete: PropTypes.bool,
	newCategoryName: PropTypes.string,
	oldCategoryName: PropTypes.string,
	handleClose: PropTypes.func,
	handleConfirmClose: PropTypes.func,
	handleConfirmed: PropTypes.func,
	handleDelete: PropTypes.func,
	handleInputChange: PropTypes.func,
	handleToggle: PropTypes.func,
	handleUpdate: PropTypes.func,
	onModifyCategoryList: PropTypes.func,
}

export default withStyles(styles)(CategoryListComponent)
