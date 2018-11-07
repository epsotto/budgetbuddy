import React, { Component } from 'react'
import { Grid, Typography, CircularProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import CustomTableComponent from '../component/CustomTableComponent'
import DatePickerComponent from '../component/DatePickerComponent'
import CustomDialogComponent from '../component/CustomDialogComponent'
import CategoryListComponent from '../component/CategoryListComponent'
import CategoryDialogComponent from '../component/CategoryDialogComponent'
import moment from 'moment'
import HeaderButton from '../component/HeaderButtons'
import fire from '../config/Fire'
import PropTypes from 'prop-types'

const db = fire.firestore('budgetbuddy')
const settings = { timestampsInSnapshots: true }
db.settings(settings)
const usersRef = db.collection('users')
const expensesRef = db.collection('expense')

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
		borderBottom: '1px solid white',
		color: theme.palette.primary[500],
		height: '40px',
	},
	paper: {
		padding: theme.spacing.unit * 2,
	},
})

class Expense extends Component {
	constructor() {
		super()

		this.state = {
			selectedDate: new moment().format('DD/MM/YYYY'),
			transactionType: 'expense',
			categoryList: [],
			expenseList: [],
			uid: sessionStorage.getItem('user'),
			itemLoader: true,
			categoryLoader: true,
		}
	}

	componentDidMount() {
		if (this.state.uid !== null) {
			usersRef
				.doc(this.state.uid)
				.get()
				.then((doc) => {
					if (doc.exists) {
						this.setState({
							categoryList: doc.data().userPreference.expenseCategories,
							categoryLoader: false,
						})
					} else {
						this.setState({ categoryList: [] })
						console.log('Document not found')
					}
				})
				.catch((error) => {
					console.log('Error while fetching data. Please refresh.')
				})

			expensesRef.where('uid', '==', this.state.uid).get().then((docs) => {
				if (!docs.empty) {
					let expenseItem = {
						name: '',
						category: '',
						amount: '',
						isReccuring: '',
						recurrence: '',
					}
					let pulledExpenseList = []
					docs.forEach((item) => {
						expenseItem.name = item.data().name
						expenseItem.category = item.data().category
						expenseItem.amount = item.data().amount
						expenseItem.isReccuring = item.data().isReccuring
						expenseItem.recurrence = expenseItem.isReccuring === 'false' ? 'none' : item.data().recurrence

						pulledExpenseList = pulledExpenseList.concat(expenseItem)
					})

					this.setState({ expenseList: pulledExpenseList, itemLoader: false })
				}
			})
		} else {
			setTimeout(function(){
				window.location.reload(true)
			}, 1000)
		}
	}

	handleAdd = (data) => {
		let newExpense = this.state.expenseList.concat(data.item)

		expensesRef
			.add({
				name: data.item.name,
				category: data.item.category,
				amount: data.item.amount,
				isRecurring: data.item.isRecurring,
				recurrence: data.item.recurrence,
				uid: this.state.uid,
				createDttm: moment(this.state.selectedDate, 'DD/MM/YYYY').valueOf(),
				updateDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
			})
			.then(() => {
				this.setState({ expenseList: newExpense })
			})
	}

	handleCategoryAdd = (data) => {
		let newCategory = this.state.categoryList.concat(data.categoryName)
		if (this.state.categoryList.indexOf(data.categoryName.toLowerCase()) < 0) {
			newCategory = this.state.categoryList.concat(data.categoryName.toLowerCase())

			usersRef
				.doc(this.state.uid)
				.update({
					updateDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
					'userPreference.expenseCategories': newCategory,
				})
				.then(() => {
					this.setState({ categoryList: newCategory })
				})
		} else {
			console.log('Category already exists.')
		}
	}

	handleDateChange = (data) => {
		this.setState({ selectedDate: data.format('DD/MM/YYYY') })

		expensesRef
			.where('uid', '==', this.state.uid)
			.where('createDttm', '==', moment(data, 'DD/MM/YYYY').valueOf())
			.get()
			.then((snapShot) => {
				let expenseItem = {
					name: '',
					category: '',
					amount: '',
					isReccuring: '',
					recurrence: '',
				}
				let pulledExpenseList = []
				if (!snapShot.empty) {
					snapShot.forEach((item) => {
						expenseItem.name = item.data().name
						expenseItem.category = item.data().category
						expenseItem.amount = item.data().amount
						expenseItem.isRecurring = item.data().isRecurring
						expenseItem.recurrence = item.data().isRecurring === 'true' ? item.data().recurrence : 'none'

						pulledExpenseList = pulledExpenseList.concat(expenseItem)

						expenseItem = {
							name: '',
							category: '',
							amount: '',
							isReccuring: '',
							recurrence: '',
						}
					})

					this.setState({ expenseList: pulledExpenseList })
				} else {
					console.log(snapShot)
					this.setState({ expenseList: [] })
				}
			})
	}

	handleModifyCategory = (data) => {
		const { isDelete, newCategoryName, oldCategoryName } = data

		let newCategoryList = this.state.categoryList
		let index = this.state.categoryList.indexOf(oldCategoryName)

		if (isDelete) {
			newCategoryList.splice(index, 1)

			usersRef
				.doc(this.state.uid)
				.update({
					updateDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
					'userPreference.expenseCategories': newCategoryList,
				})
				.then(() => {
					this.setState({
						cateogryList: newCategoryList,
					})
				})
		} else {
			newCategoryList[index] = newCategoryName

			usersRef
				.doc(this.state.uid)
				.update({
					updateDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
					'userPreference.expenseCategories': newCategoryList,
				})
				.then(() => {
					this.setState({
						cateogryList: newCategoryList,
					})
				})
		}
	}

	handleModifyItem = (data) => {
		let newItemList = this.state.expenseList

		if (data.isDelete) {
			expensesRef
				.where('uid', '==', this.state.uid)
				.where('createDttm', '==', moment(this.state.selectedDate, 'DD/MM/YYYY').valueOf())
				.get()
				.then((docRef) => {
					if (!docRef.empty) {
						docRef.forEach((item) => {
							item.ref.delete().then(() => {
								newItemList.splice(data.id, 1)
								this.setState({ expenseList: newItemList })
							})
						})
					} else {
						console.log('Document not found')
					}
				})
		} else {
			expensesRef
				.where('uid', '==', this.state.uid)
				.where('createDttm', '==', moment(this.state.selectedDate, 'DD/MM/YYYY').valueOf())
				.get()
				.then((docRef) => {
					if (!docRef.empty) {
						docRef.forEach((item) => {
							item.ref
								.update({
									name: data.newName,
									category: data.newCategory,
									amount: data.newAmount,
									isRecurring: data.newIsRecurring,
									recurrence: data.newRecurrence,
									updateDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
								})
								.then(() => {
									newItemList[data.id].name = data.newName
									newItemList[data.id].category = data.newCategory
									newItemList[data.id].amount = data.newAmount
									newItemList[data.id].isRecurring = data.newIsRecurring
									newItemList[data.id].recurrence = data.newRecurrence

									this.setState({ expenseList: newItemList })
								})
						})
					} else {
						console.log('Document not found')
					}
				})
		}
	}

	render() {
		const { classes } = this.props

		return (
			<Grid item xs={12} className={classes.widgetsContainer}>
				<Grid container className={classes.userTitle}>
					<Grid item xs={11}>
						<Typography variant="headline" color="inherit">
							Expenses
						</Typography>
					</Grid>
					<HeaderButton />
				</Grid>
				<Grid container>
					<Grid item xs={12}>
						<Typography variant="display1" color="primary">
							<DatePickerComponent onDateChange={this.handleDateChange} />
						</Typography>
						{this.state.itemLoader && this.state.categoryLoader ? (
							<CircularProgress />
						) : (
							<Grid container spacing={8}>
								<Grid item xs={8}>
									<CustomDialogComponent
										onAdd={this.handleAdd}
										type={this.state.transactionType}
										categoryChoice={this.state.categoryList}
									/>
									<CustomTableComponent
										dataList={this.state.expenseList}
										onModifyItemList={this.handleModifyItem}
										categoryChoice={this.state.categoryList}
									/>
								</Grid>
								<Grid item xs={4}>
									<CategoryDialogComponent
										onCategoryAdd={this.handleCategoryAdd}
										dateSelected={this.state.selectedDate}
										type={this.state.transactionType}
									/>
									<CategoryListComponent
										categoryList={this.state.categoryList}
										onModifyCategoryList={this.handleModifyCategory}
									/>
								</Grid>
							</Grid>
						)}
					</Grid>
				</Grid>
			</Grid>
		)
	}
}

Expense.PropTypes = {
	classes: PropTypes.object,
	selectedDate: PropTypes.string,
	transactionType: PropTypes.string,
	categoryList: PropTypes.arrayOf(PropTypes.string),
	expenseList: PropTypes.object,
	uid: PropTypes.string,
	handleAdd: PropTypes.func,
	handleCategoryAdd: PropTypes.func,
	handleModifyCategory: PropTypes.func,
	handleModifyItem: PropTypes.func,
	onDateChange: PropTypes.func,
	itemLoader: PropTypes.bool,
	categoryLoader: PropTypes.bool,
}

export default withStyles(styles)(Expense)
