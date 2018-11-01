import React, { Component } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Button,
	FormControlLabel,
	Checkbox,
	MenuItem,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import NumberFormat from 'react-number-format'
import red from '@material-ui/core/colors/red'

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

const CustomTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.primary[700],
		color: theme.palette.secondary[50],
		textAlign: 'center',
	},
	body: {
		fontSize: 14,
		textAlign: 'center',
		'&:first-child': {
			textAlign: 'left',
			padding: theme.spacing.unit * 2,
		},
	},
}))(TableCell)

const rows = [
	{ id: 'itemName', numeric: false, disablePadding: true, label: 'Item Name' },
	{ id: 'itemCategory', numeric: true, disablePadding: false, label: 'Item Category' },
	{ id: 'amount', numeric: true, disablePadding: false, label: 'Amount ($)' },
	{ id: 'recurrence', numeric: true, disablePadding: false, label: 'Recurrence' },
]

class EnhancedTableHead extends Component {
	render() {
		return (
			<TableHead>
				<TableRow>
					{rows.map((row) => {
						return (
							<CustomTableCell
								key={row.id}
								numeric={row.numeric}
								padding={row.disablePadding ? 'none' : 'default'}
							>
								{row.label}
							</CustomTableCell>
						)
					}, this)}
				</TableRow>
			</TableHead>
		)
	}
}

EnhancedTableHead.propTypes = {
	rowCount: PropTypes.number.isRequired,
}

const styles = (theme) => ({
	root: {
		width: '100%',
		padding: theme.spacing.unit * 2,
		backgroundColor: '#ffffff',
	},
	table: {
		minWidth: 700,
	},
	tableWrapper: {
		overflowX: 'auto',
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
		'&:hover': {
			cursor: 'pointer',
		},
	},
	deleteButton: {
		color: red[700],
	},
	emptyTable: {
		textAlign: 'center',
	},
})

class CustomTableComponent extends Component {
	state = {
		page: 0,
		rowsPerPage: 5,
		open: false,
		confirm: false,
		isDelete: false,
		selectedItem: [],
		newName: '',
		newCategory: '',
		newAmount: 0,
		newIsRecurring: 'false',
		newRecurrence: '',
		index: 0,
	}

	handleClick = (event, id) => {
		const { dataList } = this.props
		let selectedItem = dataList[id]

		let isReccuring =
			selectedItem.recurrence !== '' || selectedItem.recurrence.toLowerCase() !== 'none' ? 'true' : 'false'

		this.setState({
			index: id,
			open: true,
			oldItem: selectedItem,
			newName: selectedItem.name,
			newCategory: selectedItem.category,
			newAmount: selectedItem.amount,
			newIsRecurring: isReccuring,
			newRecurrence: selectedItem.recurrence,
		})
	}

	handleChangePage = (event, page) => {
		this.setState({ page })
	}

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value })
	}

	handleClose = () => {
		this.setState({ open: false })
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

	handleUpdateItem = () => {
		const { onModifyItemList } = this.props

		this.setState({
			open: false,
			confirm: false,
		})

		if (onModifyItemList) {
			onModifyItemList({
				id: this.state.index,
				isDelete: false,
				newName: this.state.newName,
				newCategory: this.state.newCategory,
				newAmount: this.state.newAmount,
				newIsRecurring: this.state.newIsRecurring,
				newRecurrence: this.state.newRecurrence,
				oldItem: this.state.oldItem,
			})
		}
	}

	handleDeleteItem = () => {
		this.setState({ confirm: true })
	}

	handleConfirmClose = () => {
		this.setState({ confirm: false })
	}

	handleConfirmed = () => {
		const { onModifyItemList } = this.props

		this.setState({
			open: false,
			confirm: false,
		})

		if (onModifyItemList) {
			onModifyItemList({
				id: this.state.index,
				isDelete: true,
			})
		}
	}

	render() {
		const { classes, dataList, categoryChoice } = this.props
		const { rowsPerPage, page } = this.state
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, dataList.length - page * rowsPerPage)

		return (
			<div className={classes.root}>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<EnhancedTableHead rowCount={dataList.length} />
						<TableBody>
							{dataList.length > 0 ? (
								dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, index) => {
									return (
										<TableRow
											hover
											onClick={(event) => this.handleClick(event, index)}
											tabIndex={-1}
											key={index}
											className={classes.row}
											id={index}
										>
											<CustomTableCell component="th" scope="row">
												{n.name}
											</CustomTableCell>
											<CustomTableCell numeric>{n.category}</CustomTableCell>
											<CustomTableCell numeric>{n.amount}</CustomTableCell>
											<CustomTableCell numeric>{n.recurrence}</CustomTableCell>
										</TableRow>
									)
								})
							) : (
								<TableRow>
									<TableCell colSpan={4} className={classes.emptyTable}>
										Currently have no items. Please click on Add button to add new items.
									</TableCell>
								</TableRow>
							)}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					component="div"
					count={dataList.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page',
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page',
					}}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>

				<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="Update item">
					<DialogTitle id="form-dialog-title">Update Item</DialogTitle>
					<DialogContent>
						<DialogContentText>Update the new values for the selected item.</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="newName"
							label="Item Name"
							fullWidth
							required
							value={this.state.newName}
							onChange={this.handleInputChange}
						/>
						<TextField
							margin="dense"
							select
							id="newCategory"
							name="newCategory"
							label="Item Category"
							fullWidth
							required
							value={this.state.newCategory}
							onChange={this.handleInputChange}
						>
							{categoryChoice.map((option) => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</TextField>
						<TextField
							label="Amount"
							value={this.state.newAmount}
							onChange={this.handleInputChange('amount')}
							id="newAmount"
							InputProps={{
								inputComponent: NumberFormatCustom,
							}}
						/>
						<FormControlLabel
							className={classes.checkboxLayout}
							control={
								<Checkbox
									id="newIsRecurring"
									value={this.state.newIsRecurring}
									onChange={this.handleInputChange}
									checked={this.state.newIsRecurring === 'true' ? true : false}
									color="primary"
								/>
							}
							label="Is this recurring?"
						/>
						<TextField
							label="Recurrence"
							value={this.state.newRecurrence}
							id="newRecurrence"
							fullWidth
							onChange={this.handleInputChange}
							disabled={this.state.newIsRecurring === 'true' ? false : true}
						/>
					</DialogContent>

					<DialogActions>
						<Button onClick={this.handleDeleteItem} className={classes.deleteButton}>
							Delete
						</Button>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleUpdateItem} color="primary">
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

CustomTableComponent.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CustomTableComponent)
