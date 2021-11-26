import lindsey from './images/Lindsey Graham - snarl.jpg'
import think from './images/think.png'

const Loader = ({title} : {title:string;}) => {
	return (
		<div className="groupContent photos withTop5pxMargin">
			<img src={lindsey} alt="{title}" />
			<br />
			<br />
			<h6>{title} Maybe Lindsey will <a href="https://www.gofundme.com/f/developing-a-website-to-track-trumps-crimes" target="_blank" rel="noreferrer">GoFundMe</a>? 
			&nbsp;<img src={think} alt="{title}" width="20" height="20" /></h6>
			<br />
			<br />
			<span style={{backgroundColor: "lightgray"}}>TODO: Import photo/image gallery with thumnails in folder 
				view structure and embed copyright text as appropriate + allow new direct upload.
			</span>
		</div>
	)
}

export default Loader
