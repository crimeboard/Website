
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap'
//import './style.css'


const CrimeSelector = () => {
	return (
	<div id="projectselector">
		<Navbar bg="light">
		  <Nav className="mr-auto">
			<NavDropdown title="Dropdown" id="basic-nav-dropdown">
			  <NavDropdown.Item href="#action/3.1" selected>RNC/Putin</NavDropdown.Item>
			  <NavDropdown.Item href="#action/3.2">Trump</NavDropdown.Item>
			  <NavDropdown.Item href="#action/3.3">Mafia</NavDropdown.Item>
			  <NavDropdown.Divider />
			  <NavDropdown.Item href="#action/3.4">
				Media
			  </NavDropdown.Item>
			</NavDropdown>
		  </Nav>
		</Navbar>
	  </div>
	)
}

export default CrimeSelector
