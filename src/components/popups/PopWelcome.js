//From: https://github.com/QuodAI/tutorial-react-twitter-api-login/blob/main/react/src/App.js

//import axios from 'axios';
//import { useState /*, useEffect */ } from 'react';
import { Modal, Button /*, Alert */ } from "react-bootstrap";
//import { Icon } from "@iconify/react";
//import twitterLogo from "@iconify/icons-mdi/twitter";
//import CatClaws from '../images/CatClaws.gif'

//import queryString from 'query-string';


const AuthLogin = (props) => {
  
//	const [isLoggedIn, setIsLoggedIn] = useState(false);
/*
	const [name, setName] = useState();
	const [imageUrl, setImageUrl] = useState();
	const [status, setStatus] = useState();
	const [url, setUrl] = useState();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [twitterHandle, setTwitterHandle] = useState('');
*/

	const closeModal = () => {
		props.closeModal();	//e.g. dismiss by updating state in parent (which cascades back via props)
	}
	
	return (
		<>	
			<Modal id="introPopup" show={(props.hasOpeningPopupBeenClosed === false)} onHide={closeModal}>
				<form autoComplete="off">
					<Modal.Header closeButton>
						<Modal.Title>Welcome to the Rebel Alliance</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="row">
							<div className="form-group col-md-12 txtMiddle">
								<img src="/CatClaws.gif" alt="Cat a Claws" title="Cat a Claws" />
								<div>"Cat a Claws" 😺</div>
								<br />
								If approved, you can login at the top-right of our 
								website with your social media account to contribute additions
								and updates.
								<br />
								Thank you.
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