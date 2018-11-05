import React, { Fragment, PureComponent } from 'react'
import { DatePicker } from 'material-ui-pickers'
import '../App.css'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

export default class DatePickerComponent extends PureComponent {
	constructor() {
		super()
		this.state = {
			selectedDate: new Date(),
		}

		this.handleDateChange = this.handleDateChange.bind(this)
	}

	handleDateChange = (date) => {
		const onDateChange = this.props
		this.setState({ selectedDate: date })

		if (onDateChange) {
			this.props.onDateChange(date)
		}
	}

	render() {
		return (
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<Fragment>
					<div className="picker">
						<Typography variant="headline">
							<DatePicker
								keyboard
								value={this.state.selectedDate}
								format="DD/MM/YYYY"
								onChange={this.handleDateChange}
								animateYearScrolling
								showTodayButton
								disableFuture
								label="Record shown as of"
							/>
						</Typography>
					</div>
				</Fragment>
			</MuiPickersUtilsProvider>
		)
	}
}

DatePickerComponent.propTypes = {
	onDateChange: PropTypes.func,
	selectedDate: PropTypes.string,
}
