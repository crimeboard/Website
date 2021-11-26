import { Icon } from '@iconify/react'
import closeIcon from '@iconify/icons-mdi/close-circle'
//import wikipediaIcon from '@iconify/icons-mdi/wikipedia'
//import wikipedia from '../images/wikipedia.png'
//import Loader from '../Loader'

const PopMenu = ({ node, close }) => {
	return (
		<div className="map-info">
			<div className="menuHeader">
				<span id="mapInfoCloseX"><Icon alt="Close" icon={closeIcon} onClick={close} /></span>
				<h4>{node.name}</h4>
			</div>
			<ul>
				<li>{node.description}</li>
				{node.wikipediaUrl !== "" &&
					<li id="wikipedia">
						<a href={node.wikipediaUrl} target="_blank" rel="noreferrer">
							<img src="/Icons/Wikipedia.png" width="25px" height="25px" className="menuIconLeft" alt="Wikipedia" />
							{node.wikipediaUrl}
						</a>
					</li>
				}
			</ul>
		</div>
	)
}

export default PopMenu