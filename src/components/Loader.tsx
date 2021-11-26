import spinner from './daisy-spinner.gif'

const Loader = ({title} : {title:string;}) => {
	return (
		<div className="loader">
			<img src={spinner} alt="{title}" />
			<br />
			<h6>{title}</h6>
		</div>
	)
}

export default Loader
