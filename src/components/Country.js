//From: https://jaywilz.github.io/react-bootstrap-country-select/
import React, { useState } from 'react';
import CountrySelect from 'react-bootstrap-country-select';

const Country = () => {

  const [ value, setValue ] = useState(null); 

  return (
	<CountrySelect cssStyle="z-index:2000;"
	  value={value}
	  onChange={setValue}
	/>
  );

};

export default Country;