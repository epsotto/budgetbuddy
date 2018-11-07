import React, { Component } from 'react'
import { Grid, Typography, CircularProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import CustomTableComponent from '../component/CustomTableComponent'
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
const loansRef = db.collection('loan')

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

class Loans extends Component {
	constructor() {
		super()

		this.state = {
			transactionType: 'loan',
			categoryList: [],
			loansList: [],
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
						this.setState({ categoryList: doc.data().userPreference.loanCategories, categoryLoader: false })
					} else {
						this.setState({ categoryList: [] })
						console.log('Document not found')
					}
				})
				.catch((error) => {
					console.log('Error while fetching data. Please refresh.')
				})

			loansRef.where('uid', '==', this.state.uid).get().then((docs) => {
				if (!docs.empty) {
					let loanItem = {
						name: '',
						category: '',
						amount: '',
						isReccuring: '',
						recurrence: '',
					}
					let pulledLoanList = []
					docs.forEach((item) => {
						loanItem.name = item.data().name
						loanItem.category = item.data().category
						loanItem.amount = item.data().amount
						loanItem.isReccuring = item.data().isReccuring
						loanItem.recurrence = loanItem.isReccuring === 'false' ? 'none' : item.data().recurrence

						pulledLoanList = pulledLoanList.concat(loanItem)
					})

					this.setState({ loansList: pulledLoanList, itemLoader: false })
				}
			})
		} else {
			setTimeout(function(){
				window.location.reload(true)
			}, 1000)
		}
	}

	handleAdd = (data) => {
		data.item.recurrence = data.item.isRecurring === 'false' ? 'none' : data.item.recurrence
		let newLoan = this.state.loansList.concat(data.item)

		loansRef
			.add({
				name: data.item.name,
				category: data.item.category,
				amount: data.item.amount,
				isRecurring: data.item.isRecurring,
				recurrence: data.item.recurrence,
				uid: this.state.uid,
				createDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
				updateDttm: moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY').valueOf(),
			})
			.then(() => {
				this.setState({ loansList: newLoan })
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
					'userPreference.loanCategories': newCategory,
				})
				.then(() => {
					this.setState({ categoryList: newCategory })
				})
		} else {
			console.log('Category already exists.')
		}
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
					'userPreference.loanCategories': newCategoryList,
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
					'userPreference.loanCategories': newCategoryList,
				})
				.then(() => {
					this.setState({
						cateogryList: newCategoryList,
					})
				})
		}
	}

	handleModifyItem = (data) => {
		let newItemList = this.state.loansList

		if (data.isDelete) {
			loansRef
				.where('uid', '==', this.state.uid)
				.where('name', '==', newItemList[data.id].name)
				.get()
				.then((docRef) => {
					if (!docRef.empty) {
						docRef.forEach((item) => {
							item.ref.delete().then(() => {
								newItemList.splice(data.id, 1)
								this.setState({ loansList: newItemList })
							})
						})
					} else {
						console.log('Document not found')
					}
				})
		} else {
			loansRef
				.where('uid', '==', this.state.uid)
				.where('name', '==', this.state.loansList[data.id].name)
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

									this.setState({ loansList: newItemList })
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
							Loans and Liabilities
						</Typography>
					</Grid>
					<HeaderButton />
				</Grid>
				<Grid container>
					<Grid item xs={12}>
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

									{this.state.loansList === [] ? (
										<CircularProgress />
									) : (
										<CustomTableComponent
											dataList={this.state.loansList}
											onModifyItemList={this.handleModifyItem}
											categoryChoice={this.state.categoryList}
										/>
									)}
								</Grid>
								<Grid item xs={4}>
									<CategoryDialogComponent
										onCategoryAdd={this.handleCategoryAdd}
										type={this.state.transactionType}
									/>
									{this.state.categoryList === [] ? (
										<CircularProgress />
									) : (
										<CategoryListComponent
											categoryList={this.state.categoryList}
											onModifyCategoryList={this.handleModifyCategory}
										/>
									)}
								</Grid>
							</Grid>
						)}
					</Grid>
				</Grid>
			</Grid>
		)
	}
}

Loans.PropTypes = {
	classes: PropTypes.object.isRequired,
	transactionType: PropTypes.string,
	categoryList: PropTypes.arrayOf(PropTypes.string),
	loansList: PropTypes.object,
	uid: PropTypes.string,
	handleAdd: PropTypes.func,
	handleCategoryAdd: PropTypes.func,
	handleModifyCategory: PropTypes.func,
	handleModifyItem: PropTypes.func,
	itemLoader: PropTypes.bool,
	categoryLoader: PropTypes.bool,
}

export default withStyles(styles)(Loans)
