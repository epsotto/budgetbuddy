import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography, CardHeader, CardContent } from '@material-ui/core'
import DatePickerComponent from '../component/DatePickerComponent'
import '../App.css'

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
})

class UpperWidget extends Component {
	constructor() {
		super()
		this.handleDateChange = this.handleDateChange.bind(this)
	}

	state = {
		selectedDate: '',
	}

	handleDateChange = (dateValue) => {
		console.log(dateValue)
		this.setState({ selectedDate: dateValue })
		console.log(this.state)
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

				<Grid container spacing={16}>
					<Grid item xs={4}>
						<Card className={classes.card} square={true}>
							<CardHeader title="This" classes={{ title: classes.cardTitle }} />
							<CardContent>
								<Typography variant="subheading" color="inherit">
									This is for income.
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={4}>
						<Card className={classes.card} square={true}>
							<CardHeader title="is a" classes={{ title: classes.cardTitle }} />
							<CardContent>
								<Typography variant="subheading" color="inherit">
									This is for expense.
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={4}>
						<Card className={classes.card} square={true}>
							<CardHeader title="test" classes={{ title: classes.cardTitle }} />
							<CardContent>
								<Typography variant="subheading" color="inherit">
									This is for remaining balance.
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default withStyles(styles)(UpperWidget)
