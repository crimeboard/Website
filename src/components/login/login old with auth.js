//From: https://github.com/QuodAI/tutorial-react-twitter-api-login/blob/main/react/src/App.js

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Modal, Button, Alert } from "react-bootstrap";
import { Icon } from "@iconify/react";
import twitterLogo from "@iconify/icons-mdi/twitter";
//import CatClaws from '../images/CatClaws.gif'

import queryString from 'query-string';

const apiPath = 'http://localhost:51846/';	//Need to add /twitter/oauth/request_token

/*

Idea: Component included by each add/update component to check if authenticated e.g. Transactions.tsx etc
	  Q: Does Header.js also needs to know? - do I even need a profile icon?
	  
	  Show popup for twitter login attached to #modal-root in index.html 

*/

const AuthLogin = (props) => {
  
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [name, setName] = useState();
	const [imageUrl, setImageUrl] = useState();
	const [status, setStatus] = useState();
	const [url, setUrl] = useState();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [twitterHandle, setTwitterHandle] = useState('');
	
	useEffect(() => {
		console.log("isLoggedIn="+ isLoggedIn);
		if (isLoggedIn === false) {

			//show login popup
			
		}
		else {
			//Authenticate - twitter auth is insecure
			/* 
			(async() => {
			
				//const {oauth_token, oauth_verifier} = queryString.parse(window.location.search);  
				const oauth_token = '';
				const oauth_verifier = '';
				
				if (oauth_token && oauth_verifier) {
					try {
						//Oauth Step 3
						await axios({
							url: `${apiPath}/twitter`,		// /oauth/access_token,  
							method: 'POST',
							data: {oauth_token, oauth_verifier}
						})
						.then ({
							//setLogin('test', 'test');	//TODO TODO TODO TODO TODO TODO TODO
						});
					} catch (error) {
						console.error(error); 
					}
				}				
				try {
					//Authenticated Resource Access
					const {data: {name, profile_image_url_https, status, entities}} = await axios({
						url: `${apiPath}/twitter/users/profile_banner`,
						method: 'GET'
					});
					
					setIsLoggedIn(true);
					setName(name);
					setImageUrl(profile_image_url_https);
					setStatus(status.text);
					setUrl(entities.url.urls[0].expanded_url);
				}
				catch (error) {
					console.error(error); 
				}
			})();
			*/
		}
	}, []);
  
	const login = () => {
		/* 
		alert('login');
		(async () => {
		
			try {
				//OAuth Step 1 - ask API ( -> Twitter ) for request token
				const response = await axios({
					url: `${apiPath}/Twitter/`,	// /twitter/oauth/request_token, 
					method: 'GET'		//No idea why example used 'POST'
				});
				
				const { oauth_token } = response.data;

				alert('oauth_token='+ oauth_token);
				//Oauth Step 2
				//Call API with oauth_token to get oauth_verifier

				//window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
			} 
			catch (error) {
				console.error(error); 
			}
		 
		})();
		*/

		//API call to verify credentials.  Bounce to verify with GUID key popup if first sign-in.


		//TODO

	}
	
	const logout = () => {
		/* 
		(async () => {
			try {
				await axios({
					url: `${apiPath}/twitter/logout`, 
					method: 'POST'
				});
				setIsLoggedIn(false);
			} 
			catch (error) {
				console.error(error); 
			}
		})();
		*/
	}

	const closeModal = () => {
		props.closeModal();	//e.g. dismiss by updating state in parent (which cascades back via props)
	}
	/*
	const handleInputChange = (e) =>
		this.setState({
			values: { ...this.state.values, [e.target.name]: e.target.value },
		});
	*/
	const submitForm = (e) => {
		//TODO
	}
	
	return (
		<>			
			<Modal id="introPopup" show={isLoggedIn === false} onHide={closeModal}>
					<form onSubmit={submitForm} autoComplete="off">
						<Modal.Header closeButton>
							<Modal.Title>Welcome to the Rebel Alliance</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className="row">
								<div className="form-group col-md-12 txtMiddle">
									<img src="/CatClaws.gif" alt="Cat a Claws" title="Cat a Claws" />
									<div>"Cat a Claws" 😺</div>

									{/* <img src={twitterLogo} className="App-logo" alt="logo" /> */}
									{/* !isLoggedIn &&

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
													maxLength="25"
													value={this.state.twitterHandle}
													onChange={this.setTwitterHandle}
												/>
											</div>
										</div>

									*/}
{/*<Button variant="primary" type="button" onClick={login}><i class="fa fa-twitter"></i> Sign in with Twitter</Button>*/}
									
									{ false && isLoggedIn &&
										<div>
											<div><img alt='User profile' src={imageUrl}/></div> 
											<div>Name: {name}</div>
											<div>URL: {url}</div>
											<div>Status: {status}</div>
											<button className='signout-btn' onClick={logout}>Sign Out</button>
										</div>
									}
									
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={closeModal} disabled={false}>Close</Button>
						</Modal.Footer>
					</form>
				</Modal>

		</>
	);
};

export default AuthLogin;