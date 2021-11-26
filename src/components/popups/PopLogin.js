/*
https://auth0.com/blog/how-to-add-a-twitter-social-connection-in-auth0/		-3rd party authentication

https://manage.auth0.com/welcome/	- YOU'LL NEED TO SETUP AN ACCOUNT WITH https://auth0.com/
https://manage.auth0.com/dashboard	- YOU'LL NEED TO SETUP AN ACCOUNT WITH https://auth0.com/
Domain: YOU'LL NEED TO SETUP AN ACCOUNT WITH https://auth0.com/
Client ID: YOU'LL NEED TO SETUP AN ACCOUNT WITH https://auth0.com/
Client Secret: YOU'LL NEED TO SETUP AN ACCOUNT WITH https://auth0.com/



Video: https://youtu.be/zj48buoJvX4

*/

import React, { Component } from "react";
//import ReactDOM from "react-dom";					 //see: https://www.youtube.com/watch?v=SmMZqh1xdB4
import { Modal, Button, Alert } from "react-bootstrap";
//import { Icon } from "@iconify/react";
//import plusIcon from "@iconify/icons-mdi/plus-circle-outline";
import Loader from "../Loader";
import { TWITTER_API_URL } from "../../constants";


class PopLogin extends Component {
	constructor(props) {
		super(props)
		this.state = {
			twitterHandle: "",
			verifyGUID: "",
			isSubmitting: false,
			isError: false,
			loading: false,						//set to false, otherwise parent will keep showing spinner
			loaderText: "Logging in..",
			isOpen: this.props.isOpen
		};

		//this.handleChange = this.handleChange.bind(this);
		//this.handleImportanceSelect = this.handleImportanceSelect.bind(this);
	}

	componentDidMount() {
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen !== this.props.isOpen) {
			this.setState({ isOpen: this.props.isOpen});
		}
		if (prevProps.verifyGUID !== this.props.verifyGUID) {
			this.setState({ verifyGUID: this.props.verifyGUID});
		}
	}

	handleInputChange = (e) =>
		this.setState({ ...this.state, [e.target.name]: e.target.value });

	closeModal = () => {
		this.props.closeModal();	//e.g. dismiss by updating state in parent (which cascades back via props)
	}

	submitForm = (e) => {
		console.log("submitting");
		this.setState({ loaderText: "Logging in.." });
		this.setState({ loading: true });
		e.preventDefault();
		this.setState({ isSubmitting: true });
		this.setState({ isError: false });

		let newUser = {
			Name: this.state.name,
			VerifyGUID: this.state.verifyGUID
		};

		fetch(TWITTER_API_URL, {
			method: "POST",
			body: JSON.stringify(newUser), //TODO: add importance_selected
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => {
			if (!res.ok) { 
				//throw res 
				this.setState({ isError: true });
			};

			//console.log(res.status);
			this.setState({ isSubmitting: false });
			this.setState({ loading: false });
			return res.json();		//Won't this cancel the statement below?  Not sure.  Maybe it propogates.
		})
		.then((data) => {
			if (this.state.isError === true)
			{
				this.setState({ message: data.detail, isError: true });				
			} 
			else {
				this.setState({ message: data.success });

				this.props.refreshDatasource(); //Calls parent to refresh DataSource

				console.log("closing modal");

				this.setState({
					name: "",
					verifyGUID: "",
					isSubmitting: false,
					isError: false
				})
				this.closeModal();
			}
		});
	};

	render() {
		return (
			<>
				{this.state.loading ? <Loader title={this.state.loaderText} /> : ''}

				<Modal show={this.state.isOpen} onHide={this.closeModal}>
					<form onSubmit={this.submitForm} autoComplete="off">
						<Modal.Header closeButton>
							<Modal.Title>New Group</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Alert show={(this.state.isError) ? true : false} variant="danger">
								{this.state.message}
							</Alert>

							<div className="row">
								<div className="form-group col-md-4">
									<label>Twitter Handle:</label>
								</div>
								<div className="form-group col-md-8">
									<input
										id="twitterHandle"
										name="twitterHandle"
										type="text"
										className="form-control"
										maxLength="15"
										value={this.state.twitterHandle}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="form-group col-md-4">
									<label>Password:</label>
								</div>
								<div className="form-group col-md-8">
									<input
										id="verifyGUID"
										name="verifyGUID"
										type="password"
										className="form-control"
										maxLength="36"
										value={this.state.verifyGUID}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={this.closeModal} disabled={this.state.isSubmitting}>Close</Button>
							<Button variant="primary" type="submit" disabled={this.state.isSubmitting}>Login</Button>
						</Modal.Footer>
					</form>
				</Modal>
			</>
		);
	}
}

export default PopLogin;
