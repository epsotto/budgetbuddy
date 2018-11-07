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
const incomesRef = db.collection('income')

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

class Income extends Component {
	constructor() {
		super()

		this.state = {
			selectedDate: new moment().format('DD/MM/YYYY'),
			transactionType: 'income',
			categoryList: [],
			incomeList: [],
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
							categoryList: doc.data().userPreference.incomeCategories,
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

			incomesRef
				.where('uid', '==', this.state.uid)
				.where('createDttm', '==', moment(this.state.selectedDate, 'DD/MM/YYYY').valueOf())
				.get()
				.then((docs) => {
					if (!docs.empty) {
						let incomeItem = {
							name: '',
							category: '',
							amount: '',
							isReccuring: '',
							recurrence: '',
						}
						let pulledIncomeList = []
						docs.forEach((item) => {
							incomeItem.name = item.data().name
							incomeItem.category = item.data().category
							incomeItem.amount = item.data().amount
							incomeItem.isReccuring = item.data().isReccuring
							incomeItem.recurrence = incomeItem.isReccuring === 'false' ? 'none' : item.data().recurrence

							pulledIncomeList = pulledIncomeList.concat(incomeItem)
						})

						this.setState({ incomeList: pulledIncomeList, itemLoader: false })
					}
				})
		} else {
			setTimeout(function(){
				window.location.reload(true)
			}, 1000)
		}
	}

	handleAdd = (data) => {
		let newIncome = this.state.incomeList.concat(data.item)

		incomesRef
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
				this.setState({ incomeList: newIncome })
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
					'userPreference.incomeCategories': newCategory,
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

		incomesRef
			.where('uid', '==', this.state.uid)
			.where('createDttm', '==', moment(data, 'DD/MM/YYYY').valueOf())
			.get()
			.then((snapShot) => {
				let incomeItem = {
					name: '',
					category: '',
					amount: '',
					isReccuring: '',
					recurrence: '',
				}
				let pulledIncomeList = []
				if (!snapShot.empty) {
					snapShot.forEach((item) => {
						incomeItem.name = item.data().name
						incomeItem.category = item.data().category
						incomeItem.amount = item.data().amount
						incomeItem.isRecurring = item.data().isRecurring
						incomeItem.recurrence = item.data().isRecurring === 'true' ? item.data().recurrence : 'none'

						pulledIncomeList = pulledIncomeList.concat(incomeItem)

						incomeItem = {
							name: '',
							category: '',
							amount: '',
							isReccuring: '',
							recurrence: '',
						}
					})

					this.setState({ incomeList: pulledIncomeList })
				} else {
					throw new Error('Document not found.')
				}
			})
			.catch((error) => {
				console.log('Error encountered. Please refresh page. ' + error)
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
					'userPreference.incomeCategories': newCategoryList,
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
					'userPreference.incomeCategories': newCategoryList,
				})
				.then(() => {
					this.setState({
						cateogryList: newCategoryList,
					})
				})
		}
	}

	handleModifyItem = (data) => {
		let newItemList = this.state.incomeList

		if (data.isDelete) {
			incomesRef
				.where('uid', '==', this.state.uid)
				.where('createDttm', '==', moment(this.state.selectedDate, 'DD/MM/YYYY').valueOf())
				.get()
				.then((docRef) => {
					if (!docRef.empty) {
						docRef.forEach((item) => {
							item.ref.delete().then(() => {
								newItemList.splice(data.id, 1)
								this.setState({ incomeList: newItemList })
							})
						})
					} else {
						console.log('Document not found')
					}
				})
		} else {
			incomesRef
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

									this.setState({ incomeList: newItemList })
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
							Income
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
										dataList={this.state.incomeList}
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

Income.PropTypes = {
	classes: PropTypes.object,
	selectedDate: PropTypes.string,
	transactionType: PropTypes.string,
	categoryList: PropTypes.arrayOf(PropTypes.string),
	incomeList: PropTypes.object,
	uid: PropTypes.string,
	handleAdd: PropTypes.func,
	handleCategoryAdd: PropTypes.func,
	handleModifyCategory: PropTypes.func,
	handleModifyItem: PropTypes.func,
	onDateChange: PropTypes.func,
	itemLoader: PropTypes.bool,
	categoryLoader: PropTypes.bool,
}

export default withStyles(styles)(Income)
