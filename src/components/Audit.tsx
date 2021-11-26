import React, { useState, useCallback } from 'react'
//import PropTypes from 'prop-types';
/*import { useCallback } from 'react'*/

import ReactDataGrid from '@inovua/reactdatagrid-community'
//import { TypeEditInfo } from '@inovua/reactdatagrid-community/types'
/** 						Note: syntax of TSX comments
* import {
* 	TypeRowProps,
* 	TypeColumn,
* } from '@inovua/reactdatagrid-community/types'
*/
import '@inovua/reactdatagrid-community/index.css'
//import ReactFlagsSelect from 'react-flags-select';

import Loader from './Loader'
//import getProgress from './fns/getProgress'
//import CountrySelect from './select/CountrySelect'

import { AUDIT_API_URL } from '../constants'
import { HEADER_PLUS_NAV_HEIGHT } from '../constants'
import Review from "./Review";
//import { POPUP_PLUS_HEIGHT } from '../constants'
//import { IMPORTANCE_DATA } from '../constants'
//import flags from './svg/flags'
//import Country from './Country';
//import { Icon } from "@iconify/react";
//import plusIcon from "@iconify/icons-mdi/plus-circle-outline";

/*
import { Editors } from "react-data-grid-addons";
*/
const gridStyle = { minHeight: window.innerHeight - HEADER_PLUS_NAV_HEIGHT, marginTop: 0 }
//const DEFAULT_ACTIVE_CELL: [number, number] = [0, 3]


//const defaultSortInfo = { name: 'surname', dir: -1 }
const scrollProps = { alwaysShowTrack: true, autoHide: false, scrollThumbWidth: 15, scrollThumbRadius: 7, scrollThumbStyle: { background: '#17A2B8' } }
//const items = [{ country: 'United States', shortName: 'usa' }]



//class Table extends React.Component {
const Audit = (props) => {

	const columns = [
		{ name: 'id', header: 'Id', defaultVisible: false, type: 'number' },
		//{ name: 'UserId', header: 'User Id', defaultVisible: false, type: 'number', maxWidth: 40 },
		{ name: 'tableName', defaultFlex: 1, header: 'Area' },		//Table name
		{ name: 'fieldName', defaultFlex: 1, header: 'Changed' },
		{ name: 'dateChanged', defaultFlex: 1, header: 'Date' },
		{ name: 'oldValue', defaultFlex: 1, header: 'Before' },
		{ name: 'newValue', defaultFlex: 1, header: 'After' },
		{ name: 'twitterHandle', defaultFlex: 1, header: 'Twitter Handle' }
	]
	

	let inEdit: boolean;
	const [oldEditValue, setOldEditValue] = useState('');
	const [gridRef, setGridRef] = useState(null);
	const [dataSource, setDataSource] = useState([]);
	const [loading, setLoading] = useState(true);	  //shouldn't this be true by default?
	const [loaderText, setloaderText] = useState('Loading');
//	const [user, setUser] = useState(props.user);
	const [isAuthenticated, setIsAuthenticated] = useState(props.isAuthenticated);
	const [userID, setUserID] = useState(props.userID);
//	const [isOpen, setIsOpen] = useState(false);	  //Modal


	console.log("Audit.js Audit(): props.isAuthenticated="+ props.isAuthenticated);

	React.useEffect(() => {
		console.log("useEffect load");
		reloadDatasource();
	}, []);						// [] stops endless reloading

	// Not sure I need this here..
	//Add another useEffect here for isAuthenticated
	React.useEffect(() => {
		console.log("Audit.js useEffect(): props.isAuthenticated="+ props.isAuthenticated +", props.userID="+ JSON.stringify(props.userID));	//== undefined
		if (props.isAuthenticated === undefined) {
			setIsAuthenticated(false);
		}
		else {
			setIsAuthenticated(props.isAuthenticated);
			setUserID(props.userID);
		}
	}, [props.isAuthenticated]);

	function reloadDatasource() {
		fetchData().then(res => {
			//setDataSource(res)
			setDataSource([].concat(res))
			console.log('Datasource updated')
			setLoading(false)
		})
		.catch(err => {
			console.error(err)
		})
	}

	const fetchData = async () => {
		setloaderText('Loading');
		setLoading(true)
		const result = await fetch(AUDIT_API_URL);
		return result.json();
	};


	return (
		<>
			{loading ? 
				<Loader title={loaderText} /> 
				: 
				<ReactDataGrid
					//onReady={gridApiRef => setGridRef(gridApiRef)}
					//onReady={setGridRef}
					idProperty="id"
					style={gridStyle}
					
					columns={columns}
					//pagination="local"
					//pageSizes={[14, 20, 40, 80]}
					//defaultLimit={14}
					//defaultSkip={14}
					sortable={true}
					//defaultSortInfo={[{ name: 'dateChanged', dir: 1 }]}		//{defaultSortInfo}
					allowUnsort={false}
					scrollTopOnSort={true}
					//autoHide={false}
					scrollProps={scrollProps}
					dataSource={dataSource}
					//defaultActiveCell={DEFAULT_ACTIVE_CELL}
					clearDataSourceCacheOnChange={true}						
				/>
			}
		</>
	);
}

/* some error..
Individuals.propTypes = {
	test: React.PropTypes.string,
	activeTab: React.PropTypes.string
};
*/

export default Audit
