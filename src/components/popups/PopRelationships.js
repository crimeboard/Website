import React, { Component } from "react"
import { Modal, Button, Alert } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import plusIcon from '@iconify/icons-mdi/plus-circle-outline'
//import GroupSelect from '../select/GroupSelect'
import SelectGroupAndIndivSingle from "../select/GroupIndivSelectSingle";
import IndividualSelect from '../select/IndividualSelect'
import Loader from '../Loader'
import {RELATIONSHIP_API_URL} from '../../constants'
//import Country from '../Country'

//import Modal from 'react-modal';

// From: https://www.pluralsight.com/guides/how-to-trigger-modal-for-react-bootstrap
// https://www.pluralsight.com/guides/submit-form-react-without-jquery-ajax

//TODO: Refresh page after adding record: https://stackoverflow.com/questions/40722382/how-to-pass-state-back-to-parent-in-react


class Popup extends Component {
	constructor(props) {
		super(props)
			this.state = {
				values: {
				description: "",
				started: "",
				ended: ""
			},
			relationship_selected: "0",
			group_indiv_selected: "0",
			individual_selected: "0",
			isSubmitting: false,
			isError: false,
			loading: false,						//set to false, otherwise parent will keep showing spinner
			loaderText: "Saving",
			isOpen: false,
			isAuthenticated: this.props.isAuthenticated,
			userID: this.props.userID
		};

		//this.handleChange = this.handleChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleRelationshipSelect = this.handleRelationshipSelect.bind(this);
		this.handleGroupIndividualSelect = this.handleGroupIndividualSelect.bind(this);
		this.handleIndividualSelect = this.handleIndividualSelect.bind(this);
	}

	componentDidMount() {
		console.log("PopRelationships:componentDidMount(): this.props.isAuthenticated="+ this.props.isAuthenticated);
		//this.setState({isAuthenticated: this.props.isAuthenticated});
		this.state.isAuthenticated = this.props.isAuthenticated;		//<= undefined
		this.state.userID = this.props.userID;
	}

	componentDidUpdate(prevProps) {
		console.log("PopRelationships:componentDidUpdate(): this.props.isAuthenticated="+ this.props.isAuthenticated);
		if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
			//this.setState({isAuthenticated: this.props.isAuthenticated});
			this.state.isAuthenticated = this.props.isAuthenticated;
			this.state.userID = this.props.userID;
		}
	}


	handleInputChange = e =>
	this.setState({
		values: { ...this.state.values, [e.target.name]: e.target.value }
	});

	handleRelationshipSelect = e => {
		console.log("rel:"+ e.target.value);
		this.setState({relationship_selected:e.target.value});
		//this.setState({values: {relationshipId:e} });
	}

	handleGroupIndividualSelect = e => {
		console.log("group/indiv:"+ e); //.target.value);
		this.setState({group_indiv_selected:e});
		//this.setState({values: {individualId:e} });
	}
	
	handleIndividualSelect = e => {
		console.log("indiv:"+ e); //.target.value);
		this.setState({individual_selected:e});
		//this.setState({values: {individualId:e} });
	}

	/*handleClose = () => {
	//setShow(false);
	reload();
	};*/
	
	openModal = () => this.setState({ isOpen: true });
	closeModal = () => this.setState({ isOpen: false });

	submitForm = e => {
		console.log("submitting");
		this.setState({ loaderText: "Saving" });
		this.setState({ loading: true });
		e.preventDefault();
		this.setState({ isSubmitting: true });
		this.setState({ isError: false });
		
		console.log(this.state.values);
		let newRelationship = {
			IndividualId: this.state.individual_selected,
			From: [this.state.group_indiv_selected],
			RelationshipTypeID: this.state.relationship_selected,
			To: [this.state.individual_selected],
			Description: this.state.values.description,
			Started: Date.now,	// this.state.values.started,
			Ended: Date.now,	// this.state.values.ended,
			UserId: this.state.userID
		};
		console.log(newRelationship);
		//alert(JSON.stringify(newRelationship));

		fetch(RELATIONSHIP_API_URL, {
			method: "POST",
			body: JSON.stringify(newRelationship),
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(res => {
			if (!res.ok) { 
				//throw res 
				this.setState({ isError: true });
			};

			//console.log(res.status);
			this.setState({ isSubmitting: false });
			this.setState({ loading: false });
			return res.json();
		})
		.then(data => {
			if (this.state.isError === true)
			{
				this.setState({ message: data.detail, isError: true });				
			} 
			else {
				this.setState({ message: data.success });

				this.props.refreshDatasource()		//Calls parent to refresh DataSource

				console.log('closing modal');		 
				
				this.setState({						//Clear for next popup
				values: {
					description: "",
					started: "",
					ended: ""
				},
				relationship_selected: "0",
				group_indiv_selected: "0",
				individual_selected: "0",
				isSubmitting: false,
				isError: false
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
				</div>

				<Modal show={this.state.isOpen} onHide={this.closeModal}>
					<form onSubmit={this.submitForm} autoComplete="off">
						<Modal.Header closeButton>
							<Modal.Title>New Relationship</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Alert show={(this.state.isError) ? true : false} variant="danger">
								{this.state.message}
							</Alert>

							<div className="row">
								<div className="form-group col-md-2">
									<label>Group or Individual:</label>
								</div>
								<div className="form-group col-md-10">
									<SelectGroupAndIndivSingle onChange={this.handleGroupIndividualSelect} value={this.state.group_indiv_selected}></SelectGroupAndIndivSingle>
								</div>
							</div>

							<div className="row">
								<div className="form-group col-md-2">
									<label>Relationship:</label>
								</div>
								<div className="form-group col-md-10">
									<select id="importanceOrSeverity" name="importanceOrSeverity"className="form-control"
										value={this.state.relationship_selected}
										onChange={this.handleRelationshipSelect}>
										<option value="0">Unassigned/Unknown</option>
										<option value="1">Owner</option>
										<option value="2">Business Partner</option>
										<option value="3">Employee</option>
										
										<option value="4">Friendship</option>
										<option value="5">Married</option>
										<option value="6">Boyfriend/Girlfriend</option>
										<option value="7">Son/Daughter of</option>
										<option value="8">Family Relative</option>
										
										<option value="9">Funded/Payed</option>
										<option value="10">President/PM</option>
										<option value="11">King/Queen/Monarchy Title</option>
										<option value="12">Government Official</option>

										<option value="13">Member</option>
										<option value="14">Sponsor</option>
										<option value="15">Affiliate</option>
									</select>
								</div>
							</div>

							<div className="row">				
								<div className="form-group col-md-2">
									<label>Individual:</label>
								</div>
								<div className="form-group col-md-10">
									<IndividualSelect onChange={this.handleIndividualSelect} value={this.state.individual_selected}></IndividualSelect>
								</div>
							</div>

							<div className="row">							
								<div className="form-group col-md-2">
									<label>Description:</label>
								</div>
								<div className="form-group col-md-10">
									<textarea id="description" 
									name="description" 
									aria-multiline="true" 
									className="form-control" 
									maxLength="500" 
									value={this.state.values.description}
									onChange={this.handleInputChange}
									rows={3}
									cols={20}
									/>
								</div>				
							</div>
							
							<div className="row">
								<div className="form-group col-md-2">
									<label>Start Date:</label>
								</div>
								<div className="form-group col-md-4">
									<input id="started" name="started" 
									type="text" 
									className="form-control" 
									maxLength="70"
									placeholder="todo"
									disabled={true}
									value={this.state.values.started}
									onChange={this.handleInputChange} />
								</div>
								
								<div className="form-group col-md-2">
									<label>End Date:</label>
								</div>
								<div className="form-group col-md-4">
									<input id="ended" name="ended" 
									type="text" 
									className="form-control" 
									maxLength="70"
									placeholder="todo"
									disabled={true}
									value={this.state.values.ended}
									onChange={this.handleInputChange} />
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
		)
	}
}

export default Popup