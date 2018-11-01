import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import '../App.css'
import UpperWidget from '../molecule/UpperWidget'
import HeaderButton from '../component/HeaderButtons'

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
})

function Home(props){
	const { classes } = props

	return (
		<Grid item xs={12} className={classes.widgetsContainer}>
			<Grid container className={classes.userTitle}>
				<Grid item xs={12}>
					<div className={classes.userHeader}>
						<Grid container>
							<Grid item xs={11}>
								<Typography variant="headline" color="inherit">
									Hello there, User!
								</Typography>
							</Grid>
							<HeaderButton />
						</Grid>
					</div>
				</Grid>
			</Grid>

			<Grid container>
				<Grid item xs={12}>
					<UpperWidget />
				</Grid>
			</Grid>
		</Grid>
	)
}

Home.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Home)
