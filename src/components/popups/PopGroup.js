import React, { Component } from "react";
//import ReactDOM from "react-dom";					 //see: https://www.youtube.com/watch?v=SmMZqh1xdB4
import { Modal, Button, Alert } from "react-bootstrap";
//import { Icon } from "@iconify/react";
//import plusIcon from "@iconify/icons-mdi/plus-circle-outline";
import Loader from "../Loader";
import { GROUPS_API_URL } from "../../constants";
//import Country from '../Country';

//import Modal from 'react-modal';

// From: https://www.pluralsight.com/guides/how-to-trigger-modal-for-react-bootstrap
// https://www.pluralsight.com/guides/submit-form-react-without-jquery-ajax

//TODO: Refresh page after adding record: https://stackoverflow.com/questions/40722382/how-to-pass-state-back-to-parent-in-react


class PopGroup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "",
			parentId: this.props.parentId,
			description: "",
			wikipediaURL: "",
			imageId: "",
			isSubmitting: false,
			isError: false,
			loading: false,						//set to false, otherwise parent will keep showing spinner
			loaderText: "Saving",
			isOpen: this.props.isOpen,
			isAuthenticated: this.props.isAuthenticated,
			userID: this.props.userID
		};

		//this.handleChange = this.handleChange.bind(this);
		//this.handleImportanceSelect = this.handleImportanceSelect.bind(this);
	}

	componentDidMount() {
		this.handleInputChange = this.handleInputChange.bind(this);
		this.state.isAuthenticated = this.props.isAuthenticated == undefined ? false : this.props.isAuthenticated;
		this.setState({ isAuthenticated: this.props.isAuthenticated});
		this.setState({ userID: this.props.userID});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen !== this.props.isOpen) {
			this.setState({ isOpen: this.props.isOpen});
		}
		if (prevProps.parentId !== this.props.parentId) {
			this.setState({ parentId: this.props.parentId});
		}
		if (prevProps.userID !== this.props.userID) {
			this.setState({ userID: this.props.userID});
		}
	}

	handleInputChange = (e) =>
		this.setState({ ...this.state, [e.target.name]: e.target.value });

	//handleImportanceSelect = e =>
	//	this.setState({importance_selected:e.target.value});

	closeModal = () => {
		this.props.closeModal();	//e.g. dismiss by updating state in parent (which cascades back via props)
	}

	submitForm = (e) => {
		console.log("submitting");
		this.setState({ loaderText: "Saving" });
		this.setState({ loading: true });
		e.preventDefault();
		this.setState({ isSubmitting: true });
		this.setState({ isError: false });

		let newGroup = {
			Name: this.state.name,
			ParentId: this.state.parentId,
			Description: this.state.description,
			WikipediaUrl: this.state.wikipediaURL,
			ImageId: 0,
			UserId: this.state.userID,
		};

		fetch(GROUPS_API_URL, {
			method: "POST",
			body: JSON.stringify(newGroup), //TODO: add importance_selected
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
			return res.json();
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
					//parentId: -1,			//commented out as gave error on re-showing popup to add another group
					description: "",
					wikipediaURL: "",
					imageId: "",
					//importance_selected: "0",
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
									<label>Name:</label>
								</div>
								<div className="form-group col-md-8">
									<input
										id="name"
										name="name"
										type="text"
										className="form-control"
										maxLength="70"
										value={this.state.name}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="form-group col-md-4">
									<label>Description:</label>
								</div>
								<div className="form-group col-md-8">
									<textarea
										id="description"
										name="description"
										aria-multiline="true"
										className="form-control"
										maxLength="500"
										value={this.state.description}
										onChange={this.handleInputChange}
										rows={3}
										cols={10}
									/>
								</div>
							</div>
							<div className="row">
								<div className="form-group col-md-4">
									<label>Wikipedia URL:</label>
								</div>
								<div className="form-group col-md-8">
									<input
										id="wikipediaURL"
										name="wikipediaURL"
										type="text"
										className="form-control"
										maxLength="150"
										value={this.state.wikipediaURL}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={this.closeModal} disabled={this.state.isSubmitting}>Close</Button>
							<Button variant="primary" type="submit" disabled={this.state.isSubmitting}>Save</Button>
						</Modal.Footer>
					</form>
				</Modal>
			</>
		);
	}
}

export default PopGroup;
