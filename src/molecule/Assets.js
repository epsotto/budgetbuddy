import React, { Component } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import CustomTableComponent from '../component/CustomTableComponent'
import DatePickerComponent from '../component/DatePickerComponent'
import CustomDialogComponent from '../component/CustomDialogComponent'
import CategoryListComponent from '../component/CategoryListComponent'
import CategoryDialogComponent from '../component/CategoryDialogComponent'
import moment from 'moment'
import HeaderButton from '../component/HeaderButtons'
import fire from '../config/Fire'

const db = fire.firestore('budgetbuddy')
const settings = { timestampsInSnapshots: true }
db.settings(settings)

function createData(name, category, amount, recurrence){
	return { name, category, amount, recurrence }
}

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

class Assets extends Component {
	constructor() {
		super()

		this.state = {
			selectedDate: new moment().format('DD/MM/YYYY'),
			transactionType: 'asset',
			categoryList: [],
			assetList: [
				// createData('PhilAm', 'insurance', 3.7, 'monthly'),
				// createData('ANZ Corp', 'investment', 25.0, 'monthly'),
				// createData('Eclair', 'investment', 16.0, 'forth-nightly'),
				// createData('sunlife', 'mutual fund', 6.0, 'annually'),
			],
			uid: sessionStorage.getItem('user'),
		}
	}

	componentDidMount() {
		if (this.state.uid !== null) {
			db
				.collection('users')
				.doc(this.state.uid)
				.get()
				.then((doc) => {
					if (doc.exists) {
						this.setState({ categoryList: doc.data().userPreference.assetCategories })
					} else {
						console.log('Document not found')
					}
				})
				.catch((error) => {
					console.log('Error while fetching data. Please refresh.')
				})

			// db.collection
		} else {
			setTimeout(function(){
				window.location.reload(true)
			}, 2000)
		}
	}

	handleAdd = (data) => {
		let newAsset = this.state.assetList.concat(data.item)
		console.log('userId: ' + this.state.uid)
		db
			.collection('users')
			.doc(this.state.uid)
			.update({
				updateDttm: Date.now(),
				'userPreference.assetCategories': newAsset,
			})
			.then(() => {
				this.setState({ assetList: newAsset })
			})
	}

	handleCategoryAdd = (data) => {
		let newCategory = []
		if (this.state.categoryList.indexOf(data.categoryName.toLowerCase()) < 0) {
			newCategory = this.state.categoryList.concat(data.categoryName.toLowerCase())

			db
				.collection('users')
				.doc(this.state.uid)
				.update({
					updateDttm: Date.now(),
					'userPreference.assetCategories': newCategory,
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
	}

	handleModifyCategory = (data) => {
		const { isDelete, newCategoryName, oldCategoryName } = data

		let newCategoryList = this.state.categoryList
		let index = this.state.categoryList.indexOf(oldCategoryName)

		if (isDelete) {
			newCategoryList.splice(index, 1)

			this.setState({
				cateogryList: newCategoryList,
			})
		} else {
			newCategoryList[index] = newCategoryName
			this.setState({ categoryList: newCategoryList })
		}
	}

	handleModifyItem = (data) => {
		let newItemList = this.state.assetList

		if (data.isDelete) {
			newItemList.splice(data.id, 1)
		} else {
			newItemList[data.id].name = data.newName
			newItemList[data.id].category = data.newCategory
			newItemList[data.id].amount = data.newAmount
			newItemList[data.id].recurrence = data.newRecurrence
		}

		this.setState({ assetList: newItemList })
	}

	render() {
		const { classes } = this.props

		return (
			<Grid item xs={12} className={classes.widgetsContainer}>
				<Grid container className={classes.userTitle}>
					<Grid item xs={11}>
						<Typography variant="headline" color="inherit">
							Assets
						</Typography>
					</Grid>
					<HeaderButton />
				</Grid>
				<Grid container>
					<Grid item xs={12}>
						<Typography variant="display1" color="primary">
							<DatePickerComponent onDateChange={this.handleDateChange} />
						</Typography>
						<Grid container spacing={8}>
							<Grid item xs={8}>
								<CustomDialogComponent
									onAdd={this.handleAdd}
									type={this.state.transactionType}
									categoryChoice={this.state.categoryList}
								/>
								<CustomTableComponent
									dataList={this.state.assetList}
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
					</Grid>
				</Grid>
			</Grid>
		)
	}
}

export default withStyles(styles)(Assets)
