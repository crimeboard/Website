import { Component } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { Icon } from "@iconify/react";
import plusIcon from "@iconify/icons-mdi/plus-circle-outline";
import { TRANSACTIONS_API_URL } from "../../constants";
//import Select from 'react-select';	//SEE: https://www.cssscript.com/multi-select-dropdown-component-javascript-slim-select/
import SelectGroupAndIndiv from "../select/GroupIndivSelect";
import Loader from '../Loader'

//TODO: Refresh page after adding record: https://stackoverflow.com/questions/40722382/how-to-pass-state-back-to-parent-in-react
/* 
const fetchData = async () => {
	//	setloaderText('Loading');
	//	setLoading(true);
	const result = await fetch(TRANSACTIONS_API_URL + "/GetAllGroupsAndIndivs/");
	//	setLoading(false);
	return result.json();
};
*/


class Popup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			values: {
				description: "",
				//importance: "",
				monetaryAmount: 0,
				minFine: 0,
				maxFine: 0,
				minSentenceYears: 0,
				maxSentenceYears: 0,
				startDate: "",
				endDate: "",
				juristictionId: "",
				twitterPostUrl: "",
				youTubeUrl: "",
				newspaperArticleUrl: ""
			},
			from: [],						//Doesn't work if moved into "values" above
			to: [],
			importance_selected: "0",
			isSubmitting: false,
			loading: false,						//set to false, otherwise parent will keep showing spinner
			loaderText: "Saving",
			isError: false,
			isOpen: false,							//Modal is open?
			isAuthenticated: this.props.isAuthenticated,
			userID: this.props.userID
		};

		//TODO: LOAD GROUPS & INDIVIDUALS INTO SELECT LISTS

		//this.handleChange = this.handleChange.bind(this);
		//this.handleInputChange = this.handleInputChange.bind(this);
		//this.handleImportanceSelect = this.handleImportanceSelect.bind(this);
		//	this.onInputChangeBy = this.onInputChangeBy.bind(this);
	}

	componentDidMount() {
		console.log("PopTransaction:componentDidMount(): this.props.isAuthenticated="+ this.props.isAuthenticated);
		//this.setState({isAuthenticated: this.props.isAuthenticated});
		this.state.isAuthenticated = this.props.isAuthenticated;		//<= undefined
		this.state.userID = this.props.userID;
	}

	componentDidUpdate(prevProps) {
		console.log("PopTransaction:componentDidUpdate(): this.props.isAuthenticated="+ this.props.isAuthenticated);
		if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
			//this.setState({isAuthenticated: this.props.isAuthenticated});
			this.state.isAuthenticated = this.props.isAuthenticated;
			this.state.userID = this.props.userID;
		}
	}

	handleInputChange = (e) =>
		this.setState({values: { ...this.state.values, [e.target.name]: e.target.value }
	});

	handleImportanceSelect = (e) => {
		this.setState({ importance_selected: e.target.value });
	};

	updateSelected(options, source) {
		// Selections from GroupIndivSelect, saving in state...
		options.map(x => console.log('T'+ x));

		if (source === "from") {
			console.log("from: " + JSON.stringify(options));
			this.setState({ from: options });			//Maybe I need to do it like this?: https://www.robinwieruch.de/react-state-array-add-update-remove
		} else if (source === "to") {
			console.log("to: " + JSON.stringify(options));
			this.setState({ to: options });
		}
	}
	// see: codesandbox.io/s/5k6mno51mp?file=/src/index.js

	/* 
	onInputChangeBy = options => {
	//if (action === "select-option") {
		console.log("options="+ options);
		//this.setState({ selectedOption: e });
		//	setSelectedOptions(options);
		this.setState({ selectedOption: options }); 
		//console.log("test:"+ this.state.selectedOption);
		//this.setState(
		//	{ selectedOption.target.value },
		//	() => console.log(`Option selected:`, this.state.selectedOption)
		//);
	//}
	}
	*/

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

		let newTransaction = {
			ID: this.state.values.Id,
			From: this.state.from,
			To: this.state.to,
			Description: this.state.values.description,
			Importance: this.state.importance_selected,								//values.importance,
			MonetaryAmount: this.state.values.monetaryAmount,
			MinFine: this.state.values.minFine,
			MaxFine: this.state.values.maxFine,
			MinSentenceYears: this.state.values.minSentenceYears,
			MaxSentenceYears: this.state.values.maxSentenceYears,
			StartDate: this.state.values.startDate,
			EndDate: this.state.values.endDate,
			JuristictionId: this.state.values.juristictionId,
			TwitterPostUrl: this.state.values.twitterPostUrl,
			YouTubeUrl: this.state.values.youTubeUrl,
			NewspaperArticleUrl: this.state.values.newspaperArticleUrl,
			UserId: this.state.userID,
		};

		console.log("posting: "+ JSON.stringify({newTransaction}));

		fetch(TRANSACTIONS_API_URL, {
			method: "POST",
			body: JSON.stringify(newTransaction), //TODO: add importance_selected
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
					//Clear for next popup
					values: {
						description: "",
						//importance: "",
						monetaryAmount: 0,
						minFine: 0,
						maxFine: 0,
						minSentenceYears: 0,
						maxSentenceYears: 0,
						startDate: "",
						endDate: "",
						juristictionId: "",
						twitterPostUrl: "",
						youTubeUrl: "",
						newspaperArticleUrl: ""
					},
					from: [],						//Doesn't work if moved into "values" above
					to: [],
					importance_selected: "0",
					isSubmitting: false,
					isError: false,
					selectedOption: []
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
							<Modal.Title>New Transaction</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Alert show={(this.state.isError) ? true : false} variant="danger">
								{this.state.message}
							</Alert>

							<div className="row">
								<div className="form-group col-md-2">
									<label>Description:</label>
								</div>
								<div className="form-group col-md-10">
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
								<div className="form-group col-md-2">
									<label>By:</label>
								</div>
								<div className="form-group col-md-10">
									{/*See: https://github.com/JedWatson/react-select*/}

									<SelectGroupAndIndiv
										name="selectFrom"
										refreshSelected={(options) =>
											this.updateSelected(options, "from")
										}
									/>
								</div>
							</div>
							{/* 
							TODO: When group/individual is added to input box, remove from the opposing list.
									Conversly, add group/individual to opposing list if removed from input box.	
							*/}
							<div className="row">
								<div className="form-group col-md-2">
									<label>To:</label>
								</div>
								<div className="form-group col-md-10">
									<SelectGroupAndIndiv
										name="selectTo"
										refreshSelected={(options) =>
											this.updateSelected(options, "to")
										}
									/>
								</div>
							</div>

							<div className="row">
								<div className="form-group col-md-2">
									<label>Importance:</label>
								</div>
								<div className="form-group col-md-4">
									<select
									id="importance"
									name="importance"
									className="form-control"
									value={this.state.importance_selected}
									onChange={this.handleImportanceSelect}
									>
										<option value="0">Unassigned</option>
										<option value="1">1 Low</option>
										<option value="2">2 Low</option>
										<option value="3">3 Low</option>
										<option value="4">4 Low-Medium</option>
										<option value="5">5 Medium</option>
										<option value="6">6 Medium</option>
										<option value="7">7 Medium-High</option>
										<option value="8">8 High</option>
										<option value="9">9 High</option>
										<option value="10">10 High</option>
									</select>
								</div>

								<div className="form-group col-md-2">
									<label>Money Paid:</label>
								</div>
								<div className="form-group col-md-4">
									<input
									id="monetaryAmount"
									name="monetaryAmount"
									type="number"
									className="form-control"
									maxLength="120"
									value={this.state.values.monetaryAmount}
									onChange={this.handleInputChange}
									/>
								</div>
							</div>

							{/* 
							<div className="row">
							<div className="form-group col-md-2">
								<label>Min Fine:</label>
							</div>
							<div className="form-group col-md-4">
								<input id="minFine" name="minFine" type="text" className="form-control" maxLength="150"
								value={this.state.values.minFine}
								onChange={this.handleInputChange} />
							</div>
							
							<div className="form-group col-md-2">
								<label>Max Fine:</label>
							</div>
							<div className="form-group col-md-4">
								<input id="maxFine" name="maxFine" type="text" className="form-control" maxLength="150"
								value={this.state.values.maxFine}
								onChange={this.handleInputChange} />
							</div>
							</div>
							<div className="row">
							<div className="form-group col-md-2">
								<label>Min. Years:</label>
							</div>
							<div className="form-group col-md-4">
								<input id="minSentenceYears" name="minSentenceYears" type="text" className="form-control" maxLength="70"
								value={this.state.values.minSentenceYears}
								onChange={this.handleInputChange} />
							</div>
							
							<div className="form-group col-md-2">
								<label>Max. Years:</label>
							</div>
							<div className="form-group col-md-4">
								<input id="maxSentenceYears" name="maxSentenceYears" type="text" className="form-control" maxLength="70"
								value={this.state.values.maxSentenceYears}
								onChange={this.handleInputChange} />
							</div>
							</div>
							*/}

							{/* 
							<div className="row">
							<div className="form-group col-md-2">
								<label>Start Date:</label>
							</div>
							<div className="form-group col-md-4">
								<input id="startDate" name="startDate" type="text" className="form-control" maxLength="70"
								value={this.state.values.startDate}
								onChange={this.handleInputChange} />
							</div>
							
							<div className="form-group col-md-2">
								<label>End Date:</label>
							</div>
							<div className="form-group col-md-4">
								<input id="endDate" name="endDate" type="text" className="form-control" maxLength="70"
								value={this.state.values.endDate}
								onChange={this.handleInputChange} />
							</div>
							</div>
							*/}

							{/* 
							<div className="row">
							<div className="form-group col-md-2">
								<label>Juristiction:</label>
							</div>
							<div className="form-group col-md-4">
								<input id="juristictionId" name="juristictionId" type="text" className="form-control" maxLength="70"
								value={this.state.values.juristictionId}
								onChange={this.handleInputChange} />
							</div>
							
							xxx
							</div>
							*/}

							<div className="row">
								<div className="form-group col-md-2">
									<label>Twitter Post URL:</label>
								</div>
								<div className="form-group col-md-10">
									<input
									id="twitterPostUrl"
									name="twitterPostUrl"
									type="text"
									className="form-control"
									maxLength="200"
									value={this.state.values.twitterPostUrl}
									onChange={this.handleInputChange}
									/>
								</div>
							</div>

							<div className="row">
								<div className="form-group col-md-2">
									<label>YouTube URL:</label>
								</div>
								<div className="form-group col-md-10">
									<input
									id="youTubeUrl"
									name="youTubeUrl"
									type="text"
									className="form-control"
									maxLength="200"
									value={this.state.values.youTubeUrl}
									onChange={this.handleInputChange}
									/>
								</div>
							</div>

							<div className="row">
								<div className="form-group col-md-2">
									<label>News Article URL:</label>
								</div>
								<div className="form-group col-md-10">
									<input
									id="newspaperArticleUrl"
									name="newspaperArticleUrl"
									type="text"
									className="form-control"
									maxLength="200"
									value={this.state.values.newspaperArticleUrl}
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

export default Popup;
