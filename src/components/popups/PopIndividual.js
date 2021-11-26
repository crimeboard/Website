import { Component } from "react";
//import { useForm } from "react-hook-form";
import { Modal, Button, Alert } from "react-bootstrap";
import { Icon } from "@iconify/react";
import plusIcon from "@iconify/icons-mdi/plus-circle-outline";
import Loader from '../Loader'
import { INDIVIDUALS_API_URL } from "../../constants";
//import Country from '../Country';

//import Modal from 'react-modal';

// From: https://www.pluralsight.com/guides/how-to-trigger-modal-for-react-bootstrap
// https://www.pluralsight.com/guides/submit-form-react-without-jquery-ajax

//TODO: Refresh page after adding record: https://stackoverflow.com/questions/40722382/how-to-pass-state-back-to-parent-in-react


class Popup extends Component {
	constructor(props) {
		super(props);

		//alert("PopIndividual.js constructor(): called.  props.isAuthenticated="+ this.props.isAuthenticated);	//<=undefined

		this.state = {
			values: {
				firstName: "",
				surname: "",
				commonName: "",
				description: "",
				countryOfBirth: "",
				importance: "",
				jobTitle: "",
				wikipediaURL: "",
				twitterHandle: "",
				imageId: ""
			},
			importance_selected: "0",
			isSubmitting: false,
			isError: false,
			loading: false,						//set to false, otherwise parent will keep showing spinner
			loaderText: "Saving",
			isOpen: false,
			isAuthenticated: this.props.isAuthenticated,
			userID: this.props.userID
		};
		//	const { register, handleSubmit, watch, errors } = useForm();
		//	const onSubmit = data => console.log(data);

		//this.handleChange = this.handleChange.bind(this);
		//this.handleInputChange = this.handleInputChange.bind(this);
		//this.handleImportanceSelect = this.handleImportanceSelect.bind(this);
	}

	componentDidMount() {
		console.log("PopIndiv:componentDidMount(): this.props.isAuthenticated="+ this.props.isAuthenticated);
		//this.setState({isAuthenticated: this.props.isAuthenticated});
		this.state.isAuthenticated = this.props.isAuthenticated === undefined ? false : this.props.isAuthenticated;
		this.state.userID = this.props.userID;
	}

	componentDidUpdate(prevProps) {
		console.log("PopIndiv:componentDidUpdate(): this.props.isAuthenticated="+ this.props.isAuthenticated);
		if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
			//this.setState({isAuthenticated: this.props.isAuthenticated});
			this.state.isAuthenticated = this.props.isAuthenticated;
			this.state.userID = this.props.userID;
		}
	}

	handleInputChange = (e) =>
		this.setState({
			values: { ...this.state.values, [e.target.name]: e.target.value },
		});

	handleImportanceSelect = (e) =>
		this.setState({ importance_selected: e.target.value });

	/*handleClose = () => {
	//setShow(false);
	reload();
	};*/

	openModal = () => this.setState({ isOpen: true });
	closeModal = () => this.setState({ isOpen: false });

	submitForm = (e) => {
		console.log("submitting");
		this.setState({ loaderText: "Saving" });
		this.setState({ loading: true });
		e.preventDefault();
		this.setState({ isSubmitting: true });
		this.setState({ isError: false });

		let newIndividual = {
			Firstname: this.state.values.firstName,
			Surname: this.state.values.surname,
			CommonName: this.state.values.commonName,
			Description: this.state.values.description,
			CountryOfBirth: this.state.values.countryOfBirth,
			Importance: this.state.importance_selected,
			JobTitle: this.state.values.jobTitle,
			WikipediaUrl: this.state.values.wikipediaURL,
			TwitterHandle: this.state.values.twitterHandle,
			ImageId: 0,
			UserId: this.state.userID,
		};

		fetch(INDIVIDUALS_API_URL, {
			method: "POST",
			body: JSON.stringify(newIndividual), //TODO: add importance_selected
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
			//console.log("data="+ JSON.stringify(data));
			if (this.state.isError === true)
			{
				this.setState({ message: data.detail, isError: true });				
			} 
			else {
				this.setState({ message: data.success });

				this.props.refreshDatasource(); //Calls parent to refresh DataSource

				console.log("closing modal");

				this.setState({
					//Clear for next popup
					values: {
						firstName: "",
						surname: "",
						commonName: "",
						description: "",
						countryOfBirth: "",
						importance: "",
						jobTitle: "",
						wikipediaURL: "",
						twitterHandle: "",
						imageId: "",
					},
					importance_selected: "0",
					isSubmitting: false,
					isError: false,
				});

				this.closeModal();
			}
		});
	};

	render() {
		return (
			<>
				{this.state.loading === true ? <Loader title={this.state.loaderText} /> : ''}

				<div className="plus-div-left">
					{this.state.isAuthenticated === true && 
						<Icon
							icon={plusIcon}
							className="plus-icon"
							onClick={this.openModal}
							enabled={true}
							style={{ color: "black" }}
						/>		
					}

					{this.state.isAuthenticated !== true && 
						<Icon
							icon={plusIcon}
							className="plus-icon"
							enabled={false}
							style={{ color: "lightgray" }}
						/>		
					}

					{/*
					<Icon
						icon={plusIcon}
						className="plus-icon"
						onClick={this.openModal}
						enabled={true}
						style={{ color: "black" }}
					/>			
					*/}
				</div>

				<Modal show={this.state.isOpen} onHide={this.closeModal}>
					<form onSubmit={this.submitForm} autoComplete="off">
						<Modal.Header closeButton>
							<Modal.Title>New Individual</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Alert show={(this.state.isError) ? true : false} variant="danger">
								{this.state.message}
							</Alert>

							<div className="row">
								<div className="form-group col-md-4">
									<label>First Name:</label>
								</div>
								<div className="form-group col-md-8">
									<input
										id="firstName"
										name="firstName"
										type="text"
										className="form-control"
										maxLength="70"
										value={this.state.values.firstName}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="form-group col-md-4">
									<label>Surname:</label>
								</div>
								<div className="form-group col-md-8">
									<input
										id="surname"
										name="surname"
										type="text"
										className="form-control"
										maxLength="70"
										value={this.state.values.surname}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="form-group col-md-4">
									<label>Full Name:</label>
								</div>
								<div className="form-group col-md-8">
									<input
										id="commonName"
										name="commonName"
										type="text"
										className="form-control"
										maxLength="120"
										value={this.state.values.commonName}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="form-group col-md-4">
									<label>Country of Birth:</label>
								</div>
								<div className="form-group col-md-8">
									{/* <Country></Country> */}

									<input
										id="countryOfBirth"
										name="countryOfBirth"
										type="text"
										className="form-control"
										maxLength="30"
										value={this.state.values.countryOfBirth}
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
										value={this.state.values.description}
										onChange={this.handleInputChange}
										rows={3}
										cols={10}
									/>
								</div>
							</div>
							<div className="row">
								<div className="form-group col-md-4">
									<label>Importance:</label>
								</div>
								<div className="form-group col-md-8">
									<select
										id="importance"
										name="importance"
										className="form-control"
										value={this.state.importance_selected}
										onChange={this.handleImportanceSelect}
									>
										<option value="0">Unassigned</option>
										<option value="1">10% Low</option>
										<option value="2">20% Low</option>
										<option value="3">30% Low</option>
										<option value="4">40% Low-Medium</option>
										<option value="5">50% Medium</option>
										<option value="6">60% Medium</option>
										<option value="7">70% Medium-High</option>
										<option value="8">80% High</option>
										<option value="9">90% High</option>
										<option value="10">100% High</option>
									</select>
								</div>
							</div>
							<div className="row">
								<div className="form-group col-md-4">
									<label>Job Title:</label>
								</div>
								<div className="form-group col-md-8">
									<input
										id="jobTitle"
										name="jobTitle"
										type="text"
										className="form-control"
										maxLength="120"
										value={this.state.values.jobTitle}
										onChange={this.handleInputChange}
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
										value={this.state.values.wikipediaURL}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
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
										maxLength="70"
										value={this.state.values.twitterHandle}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
							{/* 
				<div className="row">
				<div className="form-group col-md-4">
					<label>Image/s:</label>
				</div>
				<div className="form-group col-md-8">
					<input id="imageId" name="imageId" type="text" className="form-control"
					value={this.state.values.imageId}
					onChange={this.handleInputChange} />
				</div>
				</div>
				*/}
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

export default Popup;
