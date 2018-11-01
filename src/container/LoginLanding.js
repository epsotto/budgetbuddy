import React, { Component } from 'react'
import fire from '../config/Fire'
import userPreference from '../config/DefaultUserPreference'

const db = fire.firestore('budgetbuddy')
const settings = { timestampsInSnapshots: true }
db.settings(settings)

class LoginLanding extends Component {
	constructor(props) {
		super(props)
		this.login = this.login.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.signup = this.signup.bind(this)
		this.state = {
			email1: '',
			email2: '',
			password1: '',
			password2: '',
			firstName: '',
			lastName: '',
			address: '',
			zip: '',
			userPreference,
		}
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value })
	}

	login(e) {
		e.preventDefault()
		fire
			.auth()
			.signInWithEmailAndPassword(this.state.email1, this.state.password1)
			.then((u) => {})
			.catch((error) => {
				console.log(error)
			})
	}

	signup(e) {
		e.preventDefault()
		fire
			.auth()
			.createUserWithEmailAndPassword(this.state.email2, this.state.password2)
			.then((u) => {})
			.then((u) => {
				console.log(u)
				let user = fire.auth().currentUser
				if (user != null) {
					let user = fire.auth().currentUser
					if (user != null) {
						db
							.collection('users')
							.doc(user.uid)
							.set({
								firstName: this.state.firstName,
								lastName: this.state.lastName,
								address: this.state.address,
								zip: this.state.zip,
								email: this.state.email2,
								userPreference: userPreference,
								createDttm: Date.now(),
								updateDttm: Date.now(),
								uid: user.uid,
							})
							.then(function(){
								let user = fire.auth().currentUser
								db
									.collection('users')
									.doc(user.uid)
									.collection('transactions' + user.uid)
									.doc('runningTotal')
									.set({})
									.then(function(){})
									.catch(function(error){
										console.error('Error adding document: ', error)
									})
							})
							.catch(function(error){
								console.error('Error adding document: ', error)
							})
					}
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}
	render() {
		return (
			<div className="col-md-6">
				<form>
					<div className="form-group">
						<label htmlFor="exampleInputEmail1">Email address</label>
						<input
							value={this.state.email}
							onChange={this.handleChange}
							type="email"
							name="email1"
							className="form-control"
							id="exampleInputEmail1"
							aria-describedby="emailHelp1"
							placeholder="Enter email"
						/>
						<small id="emailHelp1" className="form-text text-muted">
							We'll never share your email with anyone else.
						</small>
					</div>
					<div className="form-group">
						<label htmlFor="exampleInputPassword1">Password</label>
						<input
							value={this.state.password}
							onChange={this.handleChange}
							type="password"
							name="password1"
							className="form-control"
							id="exampleInputPassword1"
							placeholder="Password"
						/>
					</div>
					<button type="submit" onClick={this.login} className="btn btn-primary">
						Login
					</button>
				</form>
				<form>
					<div className="form-group">
						<label htmlFor="firstName">First Name</label>
						<input
							value={this.state.firstName}
							onChange={this.handleChange}
							type="text"
							name="firstName"
							className="form-control"
							id="firstName"
							aria-labelledby="first name"
							placeholder="First Name"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="lastName">Last Name</label>
						<input
							value={this.state.lastName}
							onChange={this.handleChange}
							type="text"
							name="lastName"
							className="form-control"
							id="lastName"
							aria-labelledby="Last Name"
							placeholder="Last Name"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="exampleInputEmail2">Email address</label>
						<input
							value={this.state.email}
							onChange={this.handleChange}
							type="email"
							name="email2"
							className="form-control"
							id="exampleInputEmail2"
							aria-describedby="emailHelp"
							placeholder="Enter email"
						/>
						<small id="emailHelp" className="form-text text-muted">
							We'll never share your email with anyone else.
						</small>
					</div>
					<div className="form-group">
						<label htmlFor="exampleInputPassword2">Password</label>
						<input
							value={this.state.password}
							onChange={this.handleChange}
							type="password"
							name="password2"
							className="form-control"
							id="exampleInputPassword2"
							placeholder="Password"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="address">Address</label>
						<input
							value={this.state.address}
							onChange={this.handleChange}
							type="text"
							name="address"
							className="form-control"
							id="address"
							aria-labelledby="address"
							placeholder="Address"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="address">Zip</label>
						<input
							value={this.state.zip}
							onChange={this.handleChange}
							type="text"
							name="zip"
							className="form-control"
							id="zip"
							aria-labelledby="zip"
							placeholder="Zip"
						/>
					</div>
					<button onClick={this.signup} style={{ marginLeft: '25px' }} className="btn btn-success">
						Signup
					</button>
				</form>
			</div>
		)
	}
}

export default LoginLanding
