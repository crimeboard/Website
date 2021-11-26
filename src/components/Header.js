import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/scale-balance'
//import profileIcon from '@iconify/icons-mdi/tooltip-account'
//import ReactTooltip from "react-tooltip";
// copied from the official docs at https://fontawesome.com/how-to-use/on-the-web/using-with/react
//import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faUser  } from "@fortawesome/free-solid-svg-icons";

import { useAuth0 } from "@auth0/auth0-react";

import {
	/*Collapse,
	Container,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,*/
	Button,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,/**/
} from "reactstrap";

/*
import CrimeSelector from './CrimeSelector'
*/

const Header = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	let {
		user,
		isAuthenticated,
		loginWithRedirect,
		logout,
	} = useAuth0();
	
	console.log("Header constructor: isAuthenticated="+ isAuthenticated);
/*
	const toggle = () => setIsOpen(!isOpen);
*/
	const logoutWithRedirect = () =>
		logout({
			returnTo: window.location.origin,
		});

	//Need a useEffect to update parent state when isAuthenticated is set to true	
	useEffect(() => {
		console.log("Header: isAuthenticated="+ isAuthenticated +", props.isAuthenticated="+ props.isAuthenticated);
		//if (isAuthenticated !== props.isAuthenticated) {
			if (isAuthenticated === true && props.isAuthenticated === false) {
				props.setLogin(user);
			}
		//}
		else {
			console.log("header doesn't set prop isAuthenticated");
		}
	}, [isAuthenticated,props.isAuthenticated]);
	

	return (
		<header id="header">
			<h1><Icon icon={locationIcon} /> Crimes Commission Board</h1>
			<span id="loginTopRight">
			{!isAuthenticated && (
				<Button
					id="loginBtn"
					color="primary"
					className="btn btn-primary btn-round-sm btn-sm"
					onClick={() => loginWithRedirect({})}
				>
					Log in
				</Button>
			)}
			{isAuthenticated && (
				<>
					{/*<Icon alt="Profile" icon={profileIcon} />*/}					
					<UncontrolledDropdown>
						<DropdownToggle caret id="profileDropDown">
							<img
								src={user.picture}
								alt="Profile"
								className="rounded-circle profile-picture mb-3 mb-md-0"
								width="27px"
								height="27px"
							/>
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem header>@{props.socialHandleID}</DropdownItem>
							<DropdownItem
								/*tag={RouterNavLink}*/
								to="/profile"
								//enabled={false}
								disabled={true}
								className="dropdown-profile"
								//activeClassName="router-link-exact-active"
							>
								<FontAwesomeIcon icon={faUser} className="mr-3" disable="true" /> Profile
							</DropdownItem>
							<DropdownItem
								id="qsLogoutBtn"
								onClick={() => logoutWithRedirect()}
							>
								<FontAwesomeIcon icon={faPowerOff} className="mr-3" />
								Log out
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</>
			)}
			</span>
		</header>
	)
}


export default Header
