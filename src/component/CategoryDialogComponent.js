import React, { Component } from 'react'
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'

const styles = (theme) => ({
	root: {
		marginTop: theme.spacing.unit * 3,
	},
	checkboxLayout: {
		marginLeft: theme.spacing.unit * 3,
		paddingTop: theme.spacing.unit * 2,
	},
})

function NumberFormatCustom(props){
	const { inputRef, onChange, ...other } = props

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						value: values.value,
					},
				})
			}}
			thousandSeparator
			prefix="$"
		/>
	)
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
}

class CategoryListComponent extends Component {
	constructor() {
		super()

		this.state = {
			open: false,
			buttonType: '',
			categoryName: '',
		}

		this.handleInputChange = this.handleInputChange.bind(this)
	}

	handleClickOpen = () => {
		this.setState({ open: true })
	}

	handleClose = () => {
		this.setState({ open: false })
	}

	handleAdd = () => {
		const { onCategoryAdd } = this.props
		this.setState({ open: false })
		if (onCategoryAdd) {
			onCategoryAdd({
				categoryName: this.state.categoryName,
			})
			this.setState({
				categoryName: '',
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

	componentDidMount() {
		this.setState({ buttonType: this.props.type })
	}

	render() {
		const { classes } = this.props

		return (
			<div className={classes.root}>
				<Button onClick={this.handleClickOpen}>+ Add new {this.state.buttonType} Category</Button>
				<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Add a new {this.state.buttonType} category</DialogTitle>
					<DialogContent>
						<DialogContentText>Please fill out the form below to add a new category.</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="categoryName"
							label="Category Name"
							fullWidth
							required
							value={this.state.itemName}
							onChange={this.handleInputChange}
						/>
					</DialogContent>

					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleAdd} color="primary">
							Add
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		)
	}
}

CategoryListComponent.propTypes = {
	classes: PropTypes.object.isRequired,
	onAdd: PropTypes.func,
}

export default withStyles(styles)(CategoryListComponent)
