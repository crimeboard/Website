import { useState, useEffect } from 'react';
import Select from 'react-select';
//import { useForm } from 'react-hook-form';
//import { handleSubmit } = useForm();
import { TRANSACTIONS_API_URL } from '../../constants'


const FormComponent = (props) => {

	const [selectedOptions, setSelectedOptions] = useState([]);
	const [dataSource, setDataSource] = useState([]);

	useEffect(() => {
		fetchData().then(res => {
			//setState({dataSourceFrom:res});
			setDataSource(res);
			//setState({dataSourceTo:res});
		})
		.catch(err => {
			console.error(err)
		})
	}, [])

	const fetchData = async () => {
		//  setloaderText('Loading');
		//  setLoading(true);
		const result = await fetch(TRANSACTIONS_API_URL + "/GetAllGroupsAndIndivs/");
		//  setLoading(false);
		return result.json();
	};

	const handleChange = (options) => {
		//if (action === "select-option") {
		setSelectedOptions(options);

		let newStringArray = options.map(function (item: object) {
			return item['value'];
		});
		//console.log("options=" + JSON.stringify(options) + " - " + newStringArray);
		props.refreshSelected(newStringArray)        //Calls parent (PopTransaction) to update from/to list
		//}
		return options;
	};

	return (
		<>
			<Select
				isMulti={true}
				options={dataSource}
				closeMenuOnSelect={true}
				onChange={handleChange}
				className="basic-multi-select"
				classNamePrefix="select"
			/>
		</>
	);
}

export default FormComponent;