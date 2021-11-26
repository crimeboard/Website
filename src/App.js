import { /*useState, useEffect,*/ Component } from "react";

import Header from "./components/Header";
import Graph2D from "./components/Graph2D";
import Graph3D from "./components/Graph3D";
import Groups from "./components/Groups";
import Individuals from "./components/Individuals";
import Relationships from "./components/Relationships";
import Transactions from "./components/Transactions";
import Photos from "./components/Photos";
import Audit from "./components/Audit";
import Resources from "./components/Resources";
import About from "./components/About";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
//import Alert from "react-bootstrap/Alert";

//import PopLogin from './components/popups/PopLogin';	//Old login popup - Auth code needs to be written
import PopWelcome from './components/popups/PopWelcome';
import ReactTooltip from "react-tooltip";
import { Icon } from '@iconify/react'
import InfoTip from '@iconify/icons-mdi/info-circle'
//import { useAuth0 } from "@auth0/auth0-react";
import { TWITTER_API_URL } from "./constants";

/* 
import TabContainer from 'react-bootstrap/TabContainer'
import TabPane from 'react-bootstrap/TabPane'
import Relationships from "./components/Relationships";
*/


/*********************************************************
 * Author: Ken Murray http://www.twitter.com/kenmurrayx4
 * 
 * To update graphs with new data, see: 
 * https://forum.freecodecamp.org/t/how-to-update-the-state-of-a-sibling-component-from-another-sibling-or-imported-component-in-react/210224/8
 * Requires re-write of arrow function classes e.g. Transaction.tsx, Relationships.tsx + implement in Group.js
 * 
 * TODO: Add Earth Globe view - see: https://www.youtube.com/watch?v=WyK-ix6mgAQ&t=29s
 * Also see: https://github.com/vasturiano/globe.gl
 * Or adapt sample code in: Map.js
 * e.g. add Lat, Long, DateTime fields to CB_Transaction etc. 
 * 
 * TWITTER AUTH: Maybe best to move to backend.
 * 		See: https://auth0.com/docs/quickstart/backend/aspnet-core-webapi
 *********************************************************/


class App extends Component {
	_isMounted = false;

	constructor() {
		super();

		this.state = { 
			isAuthenticated: false, 
			hasOpeningPopupBeenClosed: false,
			socialHandleID: "",
			user: null, 
			userID: -1,
			userGUID: "",
			token: "",
			activeTab: '',			//to pause animation when tab not focused - no longer needed
			graphNeedsToUpdate: 0,			//increment on each update
			graphNeedsToUpdateOnTabFocus: false
		};

		/**
		const {
			user,
			isAuthenticated,
			loginWithRedirect,
			logout,
		} = useAuth0();
		*/

		this.handleTabSelect = this.handleTabSelect.bind(this);
	}

	/* 
	componentDidMount() {
		console.log("App.js: componentDidMount()");
		this._isMounted = true; // note this flag denote mount status
		console.log("App.js: componentDidMount() user="+ JSON.stringify(this.state.user));

		if (this.state.user !== undefined && this.state.user !== null) {
			this.setState({ isAuthenticated: true });
		}

		this._isMounted = false;
	}
	*/
	/*
	componentDidUpdate() {
		console.log("App.js: componentDidUpdate()");
		
		//if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
		//	this.setState({isAuthenticated: this.props.isAuthenticated});
		//}
		
	}
	*/
	/*
	componentWillUnmount() {
		this._isMounted = false;
	}
	*/
	
	/**
	nodeHoverTooltip = React.useCallback((node) => {
		return `<div>	 
			<b>${node.name}</b>
		</div>`;
	}, []);
	*/

	/**
	//?????????????? - where did I get this code?
	onSuccess = (response) => {
		const token = response.headers.get("x-auth-token");
		response.json().then((user) => {
			if (token) {
				this.setState({ isAuthenticated: true, user: user, token: token });
			}
		});
	};

	onFailed = (error) => {
		alert(error);
	};
	*/

	/**
	loginAuth = () => {
		console.log("loginAuth");
		this.setState({ isAuthenticated: true}); //, token: token, user: user });
	};

	logout = () => {
		console.log("logout");
		this.setState({ isAuthenticated: false, token: "", user: null });
	};
	*/

	closeModal = () => this.setState({ hasOpeningPopupBeenClosed: true });

	updateDatasource = () => this.setState({ graphNeedsToUpdateOnTabFocus: true });

	setLogin = (user) => {
		//Note. user.isAuthenticated=undefined, this.state.user=null
		//Also, don't update state until the very end - otherwise the function may exit

		//let userID = "";

		console.log("App.js: setLogin. user="+ JSON.stringify(user));
		console.log("App.js: setLogin. this.state.user="+ JSON.stringify(this.state.user));
		
		if (this.state.isAuthenticated !== true) {
			console.log("App.js: setLogin(user) user="+ JSON.stringify(user));
			console.log("App.js: setLogin(user) sub="+ JSON.stringify(user.sub));

			let socialIdentityArray = user.sub.split("|");
			let twitterOrGoogleId = socialIdentityArray[1];

			switch (socialIdentityArray[0]) {
				case "twitter":					//e.g. twitter|885968716684550145
					
					//Call backend API to get UserID
					//Call twitter API to get their user handle
					//https://api.twitter.com/2/users/123456


					//BLOCKED BY CORS - HAS TO BE DONE FROM BACKEND...
					this.setState({socialHandleID: ""});
					this.setState({userID: -1});
					this.setState({userGUID: ""});
					this.setState({isAuthenticated: false});
					
					this.fetchTwitterUserID(twitterOrGoogleId)
						.then((data) => {
							console.log("fetchTwitterUserID="+ data);
							/*this.state.user = null;
							this.state.userID = -1;
							this.state.isAuthenticated = false;*/
							//alert("userID = "+ JSON.stringify(data));
					
							if (data != null) {  // && string.length(data.id) > 0) {	
								if (data.active === true) {	
									/*this.state.user = user;
									this.state.userID = userID;
									this.state.isAuthenticated = true;*/
									//alert("active = true");
									this.setState({socialHandleID: data.twitterHandle});
									this.setState({userID: data.id});
									this.setState({userGUID: data.id});
									this.setState({isAuthenticated: true});
								}
								else {
									alert("Apologies, you will need to request pre-approval to access our system.");
								}
							}
					});
					

					break;

				case "google-oauth2":			//e.g. google-oauth2|107098797686052344583

					//TODO

					break;
			}
			
			//this.setState <= doesn't work!
			//this.setState({ user: {user}, userID: userID, socialHandleID: "", isAuthenticated: true });

//			this.setState({ hasOpeningPopupBeenClosed: true });	
		}
		else {
			//alert("App.js: setLogin. this.state.user="+ JSON.stringify(this.state.user));
		}
		
	};

	

	fetchTwitterUserID = async (userID) => {
		//this.setState({loading: true});
		//this.setState({loaderText: "Loading"});
		//alert("userID = "+ JSON.stringify(userID));
		
		let result = await fetch(TWITTER_API_URL + "/"+ userID);	//Auth0 <= doesn't return twitter handle :-/
		return result.json();
	};

	/****************************
	 * Don't know how to get users Twitter handle from their Twitter ID returned by Auth0...
	 * 
	fetchTwitterHandle = async (twitterOrGoogleId) => {				//Call Twitter to get the users handle
		//this.setState({loading: true});
		//this.setState({loaderText: "Loading"});
		
		let result = await fetch("https://api.twitter.com/2/users/" + twitterOrGoogleId);
		return result.json();
	};
	*/

	/**
	reloadDatasourceX() {
		this.setState({
			//Note: need to only allow update if a Graph tab is active
			graphNeedsToUpdate: this.state.graphNeedsToUpdate+1	//propogates to graphs to reload new data
		});
	}
	*/
	handleTabSelect(key) {
		if (key === "graph3D") {
			this.setState({ activeTab: 'graph3D'});
			if (this.state.graphNeedsToUpdateOnTabFocus === true) {
				/*
					
					TODO: Needs to propogate back down to Graph3D & Graph2D
				
				*/


				this.setState({ graphNeedsToUpdateOnTabFocus: false});
			}
		} 
		else if (key === "graph2D") {
			this.setState({ activeTab: 'graph2D'});
			//this.setState({	
				//MAKES NO SENSE HAVING THIS NOW
			//	graphNeedsToUpdateOnTabFocus: this.state.graphNeedsToUpdate	//propogates to graphs to reload new data
			//});
		}
		else {
			this.setState({ activeTab: 'other'});
		}
	};
	
	/** 
	reloadDatasource = () => {
		fetchData().then(res => {
			//setDataSource(res)
			setDataSource([].concat(res))
			console.log('Datasource updated')
			setLoading(false)
		})
		.catch(err => {
			console.error(err)
		})
	}
	*/

	//const [activeTab, setActiveTab] = useState('');

	/**
	const handleSelect = (key) => {
		console.log('x'+ key);
		if (key !== '')
		{
			localStorage.setItem('tabSelection', key);
			setActiveTab(key);
		}
	}
	const getActiveTab = () => {
		return 'individuals';
		if (this.state.activeTab == '')
		{
			const key = localStorage.getItem('tabSelection');
			console.log('y'+ key);
			if (key !== undefined)
			{
				return key;
			}
		}
		
		return 'individuals';
	}
	*/

	/** 
	function getActiveTab() {
		return "map";
	}
	*/


	render() {

		console.log("App.js render(): this.state.user="+ JSON.stringify(this.state.user))		//this.state.user => undefined

		return (
			<>
				{this.state.isAuthenticated !== true &&
					<PopWelcome hasOpeningPopupBeenClosed={this.state.hasOpeningPopupBeenClosed || this.state.isAuthenticated} closeModal={() => this.closeModal()} />
				}
				{/*
				this.state.isAuthenticated == false ? <PopLogin refreshDatasource={() => this.reloadDatasource()} : '' />
				*/}

				<div>
					<Header isAuthenticated={this.state.isAuthenticated} setLogin={(user) => this.setLogin(user)}
						socialHandleID={this.state.socialHandleID} />
					<div id="content">

						{/*<Tabs defaultActiveKey="individuals" activeKey={getActiveTab} onSelect={handleSelect}>*/}
						<Tabs defaultActiveKey="graph3D" mountOnEnter={true} onSelect={this.handleTabSelect}>
							<Tab eventKey="graph3D" title="Graph 3D">
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip" className="register-tip" place='bottom' effect='solid'>
									NAV:<br />
									Click node for info<br />
									Drag left button to rotate<br />
									Drag right to move<br />
									Scroll wheel to zoom
									<hr />
									TODO:<br />
									Show icons + refresh on update
								</ReactTooltip>

								<div id="3dGraph">
									<Graph3D activeTab={this.state.activeTab} />		{/*  graphNeedsToUpdate={this.state.graphNeedsToUpdate} */}
								</div>
							</Tab>
							<Tab eventKey="graph2D" title="Graph 2D">						
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip2"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip2" className="register-tip" place="bottom" effect="solid">
									NAV:<br />
									Click node for info<br />
									Drag left button to move<br />
									Scroll wheel to zoom
									<hr />
									TODO:<br />
									Show icons + refresh on update
								</ReactTooltip>

								<div id="graphSvg">
									<Graph2D activeTab={this.state.activeTab} />		{/*  graphNeedsToUpdate={this.state.graphNeedsToUpdate} */}
								</div>
							</Tab>

							{/*

							TODO: Add Earth Globe view - see: https://www.youtube.com/watch?v=WyK-ix6mgAQ&t=29s
							Also see: https://github.com/vasturiano/globe.gl
							
							*/}

							{/*

							TODO: Maybe a stats tab too with Venn Diagrams?
							
							*/}
							
							<Tab eventKey="stats" title="Geo/Stats" disabled={false}>
								TODO
							</Tab>

							<Tab eventKey="groups" title="Groups">					
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip3"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip3" className="register-tip" place="bottom" effect="solid">
									Governments, Companies, Organizations or Groups engaging in
									criminal activity.
									<hr />
									TODO:<br />
									Implement Save re-order changes.
								</ReactTooltip>

								<Groups isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} 
										userGUID={this.state.userGUID} refreshDatasource={() => this.updateDatasource()}/>
							</Tab>
							<Tab eventKey="relationship" title="Relationship">					
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip4"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip4" className="register-tip" place="bottom" effect="solid">
									Auto-saves on edit.
									<hr />
									TODO:<br />
									Popup validation on fields etc
								</ReactTooltip>

								<Relationships isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} 
										userGUID={this.state.userGUID} refreshDatasource={() => this.updateDatasource()} />
							</Tab>
							<Tab eventKey="individuals" title="Individuals">				
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip5"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip5" className="register-tip" place="bottom" effect="solid">
									Auto-saves on edit.
									<hr />
									TODO:<br />
									Popup validation on fields etc.
								</ReactTooltip>
								
								<Individuals isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} />
							</Tab>
							<Tab eventKey="transactions" title="Transactions">			
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip6"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip6" className="register-tip" place="bottom" effect="solid">
									Auto-saves on edit.
									<hr />
									TODO:<br />
									Popup validation on fields etc. Media
									reports with ascertained crime/penalty.
								</ReactTooltip>

								<Transactions isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} 
										userGUID={this.state.userGUID} refreshDatasource={() => this.updateDatasource()} />
							</Tab>
							<Tab eventKey="photos" title="Photos/Videos">		
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip7"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip7" className="register-tip" place="bottom" effect="solid">
									Upload photos and media content
								</ReactTooltip>
								
								<Photos isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} 
										userGUID={this.state.userGUID} />
							</Tab>
							<Tab eventKey="review" title="Review/Approve" disabled={this.state.isAuthenticated != true}>		
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip8"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip8" className="register-tip" place="bottom" effect="solid">
									Audit of changes + Review
								</ReactTooltip>
								
								<Audit isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} 
										userGUID={this.state.userGUID} />
							</Tab>
							<Tab eventKey="resources" title="Resources">		
								<span className="info-right todo-tab-tip" data-tip data-for="registerTip9"><Icon alt="Info/Todo" icon={InfoTip} /></span>
								<ReactTooltip id="registerTip9" className="register-tip" place="top" effect="solid">
									Useful websites, tools etc
								</ReactTooltip>

								<Resources isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} 
										userGUID={this.state.userGUID} />
							</Tab>
							<Tab eventKey="about" title="About/Todo">
								<About isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} 
										userGUID={this.state.userGUID} />
							</Tab>
						</Tabs>
					</div>
				</div>
			</>
		);
	}
}

export default App;
