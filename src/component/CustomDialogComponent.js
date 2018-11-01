import React, { Component } from 'react'
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Checkbox,
	FormControlLabel,
	MenuItem,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import moment from 'moment'
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

class CustomDialogComponent extends Component {
	constructor() {
		super()

		this.state = {
			open: false,
			selectedDate: new moment().format('DD/MM/YYYY'),
			name: '',
			category: '',
			amount: '',
			isRecurring: 'false',
			recurrence: '',
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
		const { onAdd } = this.props
		this.setState({ open: false })
		if (onAdd) {
			onAdd({
				item: {
					name: this.state.name,
					category: this.state.category,
					amount: this.state.amount,
					isRecurring: this.state.isRecurring,
					recurrence: this.state.recurrence,
				},
			})
			this.setState({
				name: '',
				category: '',
				amount: '',
				isRecurring: 'false',
				recurrence: '',
			})
		}
	}

	handleInputChange = (event) => {
		if (event.target) {
			const target = event.target
			const value = target.type === 'checkbox' ? target.checked.toString() : target.value
			const name = target.id ? target.id : target.name

			this.setState({
				[name]: value,
			})
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.dateSelected !== this.props.dateSelected) {
			this.setState({
				selectedDate: this.props.dateSelected,
			})
		}
	}

	render() {
		const { classes, type, categoryChoice } = this.props

		return (
			<div className={classes.root}>
				<Button onClick={this.handleClickOpen}>+ Add new {type}</Button>
				<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="Insert category item">
					<DialogTitle id="form-dialog-title">
						Add a new {type} item for {this.state.selectedDate}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>Please fill out the form below to add a new item.</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							name="name"
							label="Item Name"
							fullWidth
							required
							value={this.state.name}
							onChange={this.handleInputChange}
						/>
						<TextField
							margin="dense"
							id="category"
							label="Item Category"
							name="category"
							select
							fullWidth
							required
							value={this.state.category}
							onChange={this.handleInputChange}
							helperText="Please select item category"
						>
							{categoryChoice.map((option) => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</TextField>
						<TextField
							label="Amount"
							name="amount"
							value={this.state.amount}
							onChange={this.handleInputChange('amount')}
							id="amount"
							InputProps={{
								inputComponent: NumberFormatCustom,
							}}
						/>
						<FormControlLabel
							className={classes.checkboxLayout}
							control={
								<Checkbox
									id="isRecurring"
									name="isRecurring"
									value={this.state.isRecurring}
									onChange={this.handleInputChange}
									color="primary"
								/>
							}
							label="Is this recurring?"
						/>
						<TextField
							label="Recurrence"
							value={this.state.recurrence}
							id="recurrence"
							name="recurrence"
							fullWidth
							onChange={this.handleInputChange}
							disabled={this.state.isRecurring === 'true' ? false : true}
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

CustomDialogComponent.propTypes = {
	classes: PropTypes.object.isRequired,
	onAdd: PropTypes.func,
}

export default withStyles(styles)(CustomDialogComponent)
