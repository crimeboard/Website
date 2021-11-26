
function getProgress(value) {
	var perc = (value * 10) + "%";

	if (value === 0) {
		//console.log(value);
		return (
			<div className='progress'>
				<div className='progress-bar text-dark bg-light'
					role='progressbar'
					aria-valuenow={value}
					aria-valuemin={0}
					aria-valuemax={10}
					style={{width: '100%'}}>not set
				</div>
			</div>
		)
	}
	else {
		return (
			<div className='progress'>
				<div className='progress-bar bg-danger'
					role='progressbar'
					aria-valuenow={value}
					aria-valuemin={0}
					aria-valuemax={10}
					style={{width: perc}}>{perc}
				</div>
			</div>
		)
	}
}

export default getProgress;