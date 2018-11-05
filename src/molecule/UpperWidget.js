import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography, CardHeader, CardContent, CircularProgress } from '@material-ui/core'
import DatePickerComponent from '../component/DatePickerComponent'
import '../App.css'
import fire from '../config/Fire'
import moment from 'moment'
import PropTypes from 'prop-types'

const db = fire.firestore('budgetbuddy')
const settings = { timestampsInSnapshots: true }
db.settings(settings)
const assetsRef = db.collection('asset')
const loansref = db.collection('loan')
const expenseRef = db.collection('expense')
const incomeRef = db.collection('income')

const styles = (theme) => ({
	card: {
		padding: theme.spacing.unit * 2,
		backgroundColor: theme.palette.primary[500],
		color: theme.palette.secondary[50],
		maxHeight: '420px',
		overflow: 'hidden',
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
	},
	userHeader: {
		borderBottom: '1px solid white',
		color: theme.palette.primary[500],
		height: '40px',
	},
	paper: {
		padding: theme.spacing.unit * 2,
		backgroundColor: '#ffffff',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
	upperWidgetContainerTitle: {
		minHeight: '40px',
		marginBottom: '10px',
	},
	amountStyle: {
		textDecoration: 'underline',
		marginBottom: '7px',
	},
})

class UpperWidget extends Component {
	constructor() {
		super()
		this.handleDateChange = this.handleDateChange.bind(this)
		this.state = {
			monthlyIncome: 0,
			monthlyExpense: 0,
			dailyExpense: 0,
			totalLoan: 0,
			totalAsset: 0,
			totalIncome: 0,
			totalExpense: 0,
			currentNetWorth: 0,
			selectedDate: moment().format('DD/MM/YYYY'),
			uid: sessionStorage.getItem('user'),
			loader: true,
		}

		this.cardDisplayControl = this.cardDisplayControl.bind(this)
	}

	async componentDidMount() {
		let displayAsset = 0,
			displayExpense = 0,
			displayMonthlyExpense = 0,
			displayIncome = 0,
			displayLoan = 0,
			displayTotalExpense = 0,
			displayTotalIncome = 0

		let firstDayOfMonth = moment(this.state.selectedDate, 'DD/MM/YYYY').startOf('month').valueOf()
		let lastDayOfMonth = moment(this.state.selectedDate, 'DD/MM/YYYY').endOf('month').valueOf()

		if (this.state.uid !== null) {
			let queryAsset = await assetsRef.where('uid', '==', this.state.uid).get()
			if (!queryAsset.empty) {
				for (let asset of queryAsset.docs) {
					displayAsset = displayAsset + parseInt(asset.data().amount, 10)
				}
			}

			let queryExpense = await expenseRef
				.where('uid', '==', this.state.uid)
				.where('createDttm', '==', moment(this.state.selectedDate, 'DD/MM/YYYY').valueOf())
				.get()
			if (!queryExpense.empty) {
				for (let expense of queryExpense.docs) {
					displayExpense = displayExpense + parseInt(expense.data().amount, 10)
				}
			}

			let queryMonthlyExpense = await expenseRef
				.where('uid', '==', this.state.uid)
				.where('createDttm', '>=', firstDayOfMonth)
				.where('createDttm', '<=', lastDayOfMonth)
				.get()
			if (!queryMonthlyExpense.empty) {
				for (let monthlyExpense of queryMonthlyExpense.docs) {
					displayMonthlyExpense = displayMonthlyExpense + parseInt(monthlyExpense.data().amount, 10)
				}
			}

			let queryTotalExpense = await expenseRef.where('uid', '==', this.state.uid).get()
			if (!queryTotalExpense.empty) {
				for (let totalExpense of queryTotalExpense.docs) {
					displayTotalExpense = displayTotalExpense + parseInt(totalExpense.data().amount, 10)
				}
			}

			let queryIncome = await incomeRef
				.where('uid', '==', this.state.uid)
				.where('createDttm', '>=', firstDayOfMonth)
				.where('createDttm', '<=', lastDayOfMonth)
				.get()
			if (!queryIncome.empty) {
				for (let income of queryIncome.docs) {
					displayIncome = displayIncome + parseInt(income.data().amount, 10)
				}
			}

			let queryTotalIncome = await incomeRef.where('uid', '==', this.state.uid).get()
			if (!queryTotalIncome.empty) {
				for (let totalIncome of queryTotalIncome.docs) {
					displayTotalIncome = displayTotalIncome + parseInt(totalIncome.data().amount, 10)
				}
			}

			let queryLoan = await loansref.where('uid', '==', this.state.uid).get()
			if (!queryLoan.empty) {
				for (let loan of queryLoan.docs) {
					displayLoan = displayLoan + parseInt(loan.data().amount, 10)
				}
			}

			this.setState({
				monthlyIncome: displayIncome,
				dailyExpense: displayExpense,
				monthlyExpense: displayMonthlyExpense,
				totalAsset: displayAsset,
				totalLoan: displayLoan,
				totalIncome: displayTotalIncome,
				totalExpense: displayTotalExpense,
				currentNetWorth: displayAsset - displayLoan + (displayTotalIncome - displayTotalExpense),
				loader: false,
			})
		} else {
			setTimeout(function(){
				window.location.reload(true)
			}, 1000)
		}
	}

	handleDateChange = (dateValue) => {
		let displayExpense = 0
		expenseRef
			.where('uid', '==', this.state.uid)
			.where('createDttm', '==', moment(dateValue, 'DD/MM/YYYY').valueOf())
			.get()
			.then((docRef) => {
				console.log(docRef)
				if (!docRef.empty) {
					docRef.forEach((item) => {
						displayExpense = displayExpense + parseInt(item.data().amount, 10)
					})

					this.setState({
						dailyExpense: displayExpense,
						selectedDate: dateValue,
					})
				}
			})
	}

	cardDisplayControl = (type) => {
		let transactionType = type
		let amount = 0
		let index = 0
		let headerTitle = [
			"This month's income",
			"Selected day's total expense",
			'Accumulated income',
			'Total loans incurred',
		]
		let altHeaderTitle = [
			'No income recorded yet',
			'No expenses recorded yet',
			'No assets recorded yet',
			'No loans recorded yet',
		]
		let altCardContent = [
			'Click on Income tab to add a new income record.',
			'Click on Expense tab to add a new expense record.',
			'Click on Assets tab to add a new asset record.',
			'Click on Loans and Liabilities tab to add a new loan record.',
		]

		switch (transactionType) {
			case 'income':
				index = 0
				amount = this.state.monthlyIncome
				break
			case 'expense':
				index = 1
				amount = this.state.dailyExpense
				break
			case 'asset':
				index = 2
				amount = this.state.totalAsset
				break
			case 'loan':
				index = 3
				amount = this.state.totalLoan
				break
			default:
				console.log('Type unknown')
				break
		}

		let { classes } = this.props
		if (amount !== 0) {
			return (
				<Card className={classes.card} square={true}>
					<CardHeader title={headerTitle[index]} classes={{ title: classes.cardTitle }} />
					<CardContent>
						<Grid container>
							<Grid item xs={2}>
								<Typography variant="subheading" color="inherit">
									NZD
								</Typography>
							</Grid>
							<Grid item xs={10}>
								<Typography variant="display1" color="inherit" className={classes.amountStyle}>
									{amount}
								</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			)
		} else {
			return (
				<Card className={classes.card} square={true}>
					<CardHeader title={altHeaderTitle[index]} classes={{ title: classes.cardTitle }} />
					<CardContent>
						<Typography variant="subheading" color="inherit">
							{altCardContent[index]}
						</Typography>
					</CardContent>
				</Card>
			)
		}
	}

	render() {
		const { classes } = this.props

		return (
			<div className={classes.paper}>
				<Grid container className={classes.upperWidgetContainerTitle}>
					<Typography variant="display1" color="primary">
						<DatePickerComponent onDateChange={this.handleDateChange} />
					</Typography>
				</Grid>

				{this.state.loader ? (
					<CircularProgress />
				) : (
					<Grid container spacing={16}>
						<Grid item xs={4}>
							{this.cardDisplayControl('income')}
						</Grid>
						<Grid item xs={4}>
							{this.cardDisplayControl('expense')}
						</Grid>
						<Grid item xs={4}>
							<Card className={classes.card} square={true}>
								<CardHeader title="This month's balance" classes={{ title: classes.cardTitle }} />
								<CardContent>
									<Grid container>
										<Grid item xs={2}>
											<Typography variant="subheading" color="inherit">
												NZD
											</Typography>
										</Grid>
										<Grid item xs={10}>
											<Typography
												variant="display1"
												color="inherit"
												className={classes.amountStyle}
											>
												{this.state.monthlyIncome - this.state.monthlyExpense}
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				)}
				{!this.state.loader ? (
					<Grid container spacing={16}>
						<Grid item xs={4}>
							{this.cardDisplayControl('asset')}
						</Grid>
						<Grid item xs={4}>
							{this.cardDisplayControl('loan')}
						</Grid>
						<Grid item xs={4}>
							<Card className={classes.card} square={true}>
								<CardHeader title="Your current net worth" classes={{ title: classes.cardTitle }} />
								<CardContent>
									<Grid container>
										<Grid item xs={2}>
											<Typography variant="subheading" color="inherit">
												NZD
											</Typography>
										</Grid>
										<Grid item xs={10}>
											<Typography
												variant="display1"
												color="inherit"
												className={classes.amountStyle}
											>
												{this.state.currentNetWorth}
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				) : null}
			</div>
		)
	}
}

UpperWidget.propTypes = {
	classes: PropTypes.object.isRequired,
	cardDisplayControl: PropTypes.func,
	handleDateChange: PropTypes.func,
	monthlyIncome: PropTypes.number,
	monthlyExpense: PropTypes.number,
	dailyExpense: PropTypes.number,
	totalLoan: PropTypes.number,
	totalAsset: PropTypes.number,
	totalIncome: PropTypes.number,
	totalExpense: PropTypes.number,
	currentNetWorth: PropTypes.number,
	selectedDate: PropTypes.string,
	uid: PropTypes.string,
	loader: PropTypes.bool,
}

export default withStyles(styles)(UpperWidget)
