import { useState, useEffect } from 'react';
import Select from 'react-select';
//import { useForm } from 'react-hook-form';
//import { handleSubmit } = useForm();
import ReactFlagsSelect from 'react-flags-select';


const CountrySelect = (props) => {

	const [selected, setSelected] = useState(props.code);

	return (
		<>
			<ReactFlagsSelect
					selected={selected}
					onSelect={code => setSelected(code)}
				/>
		</>
	);
}

export default CountrySelect;