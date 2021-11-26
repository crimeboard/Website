//Maybe use this instead: https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/Overview/React/Light/
//		https://js.devexpress.com/NonCommercial/
//		npm install devextreme

//TODO: loader spinner not shown e.g. empty table gets shown until API loading completes

import React, { useState /*, useCallback*/ } from 'react'
//import PropTypes from 'prop-types';
/*import { useCallback } from 'react'*/

import ReactDataGrid from '@inovua/reactdatagrid-community'
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types'
import SelectEditor from '@inovua/reactdatagrid-community/SelectEditor'
/** 						Note: syntax of TSX comments
* import {
* 	TypeRowProps,
* 	TypeColumn,
* } from '@inovua/reactdatagrid-community/types'
*/
import '@inovua/reactdatagrid-community/index.css'
//import ReactFlagsSelect from 'react-flags-select';

import Popup from './popups/PopIndividual'
import Loader from './Loader'
import getProgress from './fns/getProgress'
//import CountrySelect from './select/CountrySelect'

import { INDIVIDUALS_API_URL } from '../constants'
import { HEADER_PLUS_NAV_HEIGHT } from '../constants'
import { POPUP_PLUS_HEIGHT } from '../constants'
import { IMPORTANCE_DATA } from '../constants'
import flags from './svg/flags'
//import Country from './Country';
//import { Icon } from "@iconify/react";
//import plusIcon from "@iconify/icons-mdi/plus-circle-outline";

/*
import { Editors } from "react-data-grid-addons";
*/
const gridStyle = { minHeight: window.innerHeight - HEADER_PLUS_NAV_HEIGHT - POPUP_PLUS_HEIGHT, marginTop: 0 }
//const DEFAULT_ACTIVE_CELL: [number, number] = [0, 3]


//const defaultSortInfo = { name: 'surname', dir: -1 }
const scrollProps = { alwaysShowTrack: true, autoHide: false, scrollThumbWidth: 15, scrollThumbRadius: 7, scrollThumbStyle: { background: '#17A2B8' } }
//const items = [{ country: 'United States', shortName: 'usa' }]


const columns = [
	{ name: 'id', header: 'Id', defaultVisible: false, type: 'number', maxWidth: 40 },
	{ name: 'firstname', defaultFlex: 1, header: 'First Name' },
	{ name: 'surname', defaultFlex: 1, header: 'Last Name' },
	{ name: 'commonName', defaultFlex: 1, header: 'Full Name' },
	{ 
		name: 'countryOfBirth', 
		defaultFlex: 1, 
		header: 'Born', 
		width: 70,
		sortable: true,
		sort: (p1, p2) => (p1 == null ? '' : p1).localeCompare(p2 == null ? '' : p2),
		render: ({ value })=> flags[value]? flags[value] : value 
	},	
	/*	 
	{ 
		name: 'countryOfBirth',
		header: 'Born',
		defaultFlex: 1,
		width: 70,
		render: ({ value })=> flags[value]? flags[value] : value,
		editor: SelectEditor,
		editorProps: {
		  idProperty: 'id',
		  dataSource: countryData,
		  collapseOnSelect: true,
		  clearIcon: null
		}
	  },
	*/
	{ name: 'description', defaultFlex: 1, header: 'Description' },
	{ 
		name: 'importance',
		header: 'Importance',
		type: 'number',
		defaultFlex: 1,		
		width: 100,
		sortable: true,	
		sort: (p1, p2) => p1.toString().localeCompare(p2.toString(), "en-u-kn-true"),	
		render: ({ value })=> getProgress(value),
		editor: SelectEditor,
		editorProps: {
			idProperty: 'id',
			dataSource: IMPORTANCE_DATA,
			collapseOnSelect: true,
			clearIcon: null
		}
	},
	{ name: 'jobTitle', defaultFlex: 1, header: 'Job Title' },
	{ name: 'wikipediaUrl', defaultFlex: 1, header: 'Wikipedia URL' },
	{ name: 'twitterHandle', defaultFlex: 1, header: 'Twitter Handle' },
	{ name: 'imageId', defaultFlex: 1, header: 'Image' }
];

//class Table extends React.Component {
const Individuals = (props) => {

	/*
	const countryData = [
		{ id: 'Australia', label: 'Australia' },
		{ id: 'Belarus', label: 'Belarus' },
		{ id: 'Brazil', label: 'Brazil' },
		{ id: 'Canada', label: 'Canada' },
		{ id: 'China', label: 'China' },
		{ id: 'France', label: 'France' },
		{ id: 'Germany', label: 'Germany' },
		{ id: 'Haiti', label: 'Haiti' },
		{ id: 'India', label: 'India' },
		{ id: 'Iran', label: 'Iran' },
		{ id: 'Mexico', label: 'Mexico' },
		{ id: 'Panama', label: 'Panama' },
		{ id: 'Russia', label: 'Russia' },
		{ id: 'Saudi', label: 'Saudi Arabia' },
		{ id: 'Turkey', label: 'Turkey' },
		{ id: 'Ukraine', label: 'Ukraine' },
		{ id: 'UK', label: 'United Kindom' },
		{ id: 'USA', label: 'United States' }
	]
	*/

	/* May be the wrong data grid e.g. https://codesandbox.io/s/vq5387plyy

	const { DropDownEditor } = Editors;
	const issueTypes = [
		{ id: "Not set", value: "0" },
		{ id: "10%/Low", value: "1" },
		{ id: "20%", value: "2" },
		{ id: "30%", value: "3" },
		{ id: "40%", value: "4" },
		{ id: "50%", value: "5" },
		{ id: "60%", value: "6" },
		{ id: "70%", value: "7" },
		{ id: "80%", value: "8" },
		{ id: "90%", value: "9" },
		{ id: "100%/High", value: "10" }
	];
	const IssueTypeEditor = <DropDownEditor options={issueTypes} />;
	*/

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


	console.log("Individual.js Individuals(): props.isAuthenticated="+ props.isAuthenticated);

	React.useEffect(() => {
		console.log("useEffect load");
		reloadDatasource();
	}, []);						// [] stops endless reloading

	// Not sure I need this here..
	//Add another useEffect here for isAuthenticated
	React.useEffect(() => {
		console.log("Individual.js useEffect(): props.isAuthenticated="+ props.isAuthenticated +", props.userID="+ JSON.stringify(props.userID));	//== undefined
		if (props.isAuthenticated === undefined) {
			setIsAuthenticated(false);
		}
		else {
			setIsAuthenticated(props.isAuthenticated);
			setUserID(props.userID);
		}
	}, [props.isAuthenticated, props.userID]);

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
		const result = await fetch(INDIVIDUALS_API_URL);
		return result.json();
	};

	// UPDATE FUNCTION...

	function UpdateAPI(id: string, fieldName: string, newValue: string) {
		console.log(newValue);
		setloaderText('Saving');
		setLoading(true)
		let todoItem = {
			id: id,
			fieldName: fieldName,
			newValue: newValue,
			userID: userID
		};
		//alert(JSON.stringify(todoItem));

		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(todoItem)	   //{'id' : id, 'fieldName' : fieldName, 'val': val })
		};
		fetch(INDIVIDUALS_API_URL + '/' + id, requestOptions)
		.then(response => response.json())
		.catch(err => console.log(err))
		.then(
			//data => this.setState({ id: data.id })
			() => setLoading(false)
		);
	}

	// GRID FUNCTIONS...

	const onEditStart = (editInfo: TypeEditInfo) => {
		inEdit = true;
		setOldEditValue(editInfo.value);
	};

	const onEditStop = () => {
		requestAnimationFrame(() => {
			inEdit = false;
			setOldEditValue('');			//So new edit doesn't pick up value from previous edit
			gridRef.current.focus();
		});
	};

	//TODO: don't know if I need this..
	const onKeyDown = event => {
		if (inEdit) {
			return;
		}

		const grid = gridRef.current;
		let [rowIndex, colIndex] = grid.computedActiveCell;

		if (event.key === ' ' || event.key === 'Enter') {
			const column = grid.getColumnBy(colIndex);
			if (!column) {
				return;
			}
			grid.startEdit({ columnId: column.name, rowIndex });
			event.preventDefault();
			return;
		}
		if (event.key !== 'Tab') {
			return;
		}
		event.preventDefault();
		event.stopPropagation();

		const direction = event.shiftKey ? -1 : 1;

		const columns = grid.visibleColumns;
		const rowCount = grid.count;

		colIndex += direction;
		if (colIndex === -1) {
			colIndex = columns.length - 1;
			rowIndex -= 1;
		}
		if (colIndex === columns.length) {
			rowIndex += 1;
			colIndex = 0;
		}
		if (rowIndex < 0 || rowIndex === rowCount) {
			return;
		}

		grid.setActiveCell([rowIndex, colIndex]);
	};

	const onEditComplete = (editInfo: TypeEditInfo) => {		
		if (editInfo.value +'' === oldEditValue +'')			//Only update if changed and treat null like empty string
		{
			return;
		}
		setloaderText('Saving');
		setLoading(true);
		const data = [...dataSource];
		//console.log(data)
//		alert("rowId="+ editInfo.rowId);
//		alert("rowIndex="+ editInfo.rowIndex);

		const dataIndexPos = data.findIndex(x => x.id === editInfo.rowId);	//Fixes inline edit issue when grid is resorted :-)

		//MAYBE THIS IS WHERE THE EDIT UPDATE ISSUE IS?..
//		data[editInfo.rowIndex] = Object.assign({}, data[editInfo.rowIndex], { [editInfo.columnId]: editInfo.value });
		data[dataIndexPos] = Object.assign({}, data[dataIndexPos], { [editInfo.columnId]: editInfo.value });
		//	console.info(Object.assign({}, data[editInfo.rowIndex], { [editInfo.columnId]: editInfo.value }))
		//	console.log(editInfo.value +' - '+ editInfo.rowId)
		console.log("editInfo="+ JSON.stringify(editInfo));

		UpdateAPI(editInfo.rowId, editInfo.columnId, editInfo.value)
		//editInfo.columnId == table column name e.g. "Firstname"
		//console.log(data);

		setDataSource(data);
	};

	return (
		<>
			<Popup isAuthenticated={isAuthenticated} userID={userID} refreshDatasource={() => reloadDatasource()}></Popup>

			{loading ? 
				<Loader title={loaderText} /> 
				: 
				<ReactDataGrid
					onReady={gridApiRef => setGridRef(gridApiRef)}
					idProperty="id"
					style={gridStyle}
					columns={columns}
					//pagination="local"
					//pageSizes={[14, 20, 40, 80]}
					//defaultLimit={14}
					//defaultSkip={14}
//DISABLED UNTIL SORT>EDIT ISSUE SORTED:					sortable={false}	
					//defaultSortInfo={{ name: 'surname', dir: 1 }}        //{defaultSortInfo}
					allowUnsort={false}
					scrollTopOnSort={true}
					//autoHide={false}
//DISABLED UNTIL SORT>EDIT ISSUE SORTED:					scrollProps={scrollProps}
					dataSource={dataSource}
					//defaultActiveCell={DEFAULT_ACTIVE_CELL}
					onEditComplete={onEditComplete}
					onEditStart={onEditStart}
					onEditStop={onEditStop}
					editStartEvent={"click"}
					editable={isAuthenticated}
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

export default Individuals
