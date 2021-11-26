import { Component } from "react";
/*import { Modal, Button, Alert } from "react-bootstrap";*/
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";		//Crashes VS e.g. chokidar error

import { Icon } from "@iconify/react";
import closeIcon from '@iconify/icons-mdi/close-circle';
//import twitterIcon from '@iconify/icons-mdi/twitter-circle'
//import youtubeIcon from '@iconify/icons-mdi/youtube';
//import newsIcon from '@iconify/icons-mdi/newspaper-plus';
import { TRANSACTIONS_API_URL } from "../../constants";
import Loader from '../Loader'


class PopMenuLink extends Component {
	constructor(props) {
		super(props)

		this.state = {
			values: {
				description: "",
				twitterPostUrl: "",
				youTubeUrl: "",
				newspaperArticleUrl: ""
			},
			loading: false,						//set to false, otherwise parent will keep showing spinner
			loaderText: "Saving",
			isError: false,
			isOpen: false							//Modal is open?
		};
	}

	componentDidMount() {
		let linkId = this.props.link.linkId;
		if (linkId.startsWith("Trans-")) {
			this.fetchData()
				.then((data) => {
					console.log(data);
					this.setState({description: data.description});
					this.setState({twitterPostUrl: data.twitterPostUrl});
					this.setState({youTubeUrl: data.youTubeUrl});
					this.setState({newspaperArticleUrl: data.newspaperArticleUrl});

					this.setState({loading: false});
					this.setState({loaderText: "Loading"});
			});
			/*
			fetchData().then(res => {
				this.setState({dataSourceFrom:res});
				this.setState({dataSourceTo:res});
			})
			.catch(err => {
				console.error(err)
			})
			*/

		}
		else if (linkId.startsWith("Rel-")) {

			/*
			fetchData().then(res => {
				this.setState({dataSourceFrom:res});
				this.setState({dataSourceTo:res});
			})
			.catch(err => {
				console.error(err)
			})
			*/

		}

	}

	fetchData = async () => {
		this.setState({loading: true});
		this.setState({loaderText: "Loading"});
		console.log("fetch="+ TRANSACTIONS_API_URL + "/"+ this.props.linkId.replace("Trans-",""));
		
		let result = await fetch(TRANSACTIONS_API_URL + "/"+ this.props.linkId.replace("Trans-",""));
		return result.json();
	};

	handleInputChange = (e) =>
		this.setState({values: { ...this.state.values, [e.target.name]: e.target.value }
	});

	handleImportanceSelect = (e) => {
		this.setState({ importance_selected: e.target.value });
	};


	openModal = () => this.setState({ isOpen: true });
	closeModal = () => this.setState({ isOpen: false });


	render() {
		return (
			<>
				{this.state.loading ? <Loader title={this.state.loaderText} /> : ''}

				<div className="map-info">					
					<div className="menuHeader">
						<span id="mapInfoCloseX"><Icon alt="Close" icon={closeIcon} onClick={this.props.close} /></span>
						<h4>{this.props.link.name}</h4>
					</div>
					<ul>
						<li>{this.state.description}</li>
						{
							this.state.loading === false && this.state.twitterPostUrl !== "" &&
								<li><a href={this.state.twitterPostUrl} target="_blank" rel="noreferrer">
									<img src="/Icons/Twitter.png" width="25px" height="25px" className="menuIconLeft" alt="Twitter" />
									{this.state.twitterPostUrl}</a>
								</li>
						}
						{	
							this.state.loading === false && this.state.youTubeUrl !== "" &&
								<li><a href={this.state.youTubeUrl} target="_blank" rel="noreferrer">
									<img src="/Icons/Youtube.png" width="25px" height="25px" className="menuIconLeft" alt="YouTube" />
									{this.state.youTubeUrl}
									</a>
								</li>
						}
						{	
							this.state.loading === false && this.state.newspaperArticleUrl !== "" &&
								<li>
									<a href={this.state.newspaperArticleUrl} target="_blank" rel="noreferrer">
									<img src="/Icons/News.png" width="25px" height="25px" className="menuIconLeft" alt="News" />
									{this.state.newspaperArticleUrl}</a>
								</li>
						}
					</ul>
				</div>
			</>
		);
	}
}

export default PopMenuLink;
