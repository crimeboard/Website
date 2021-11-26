//Maybe use this instead: https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/Overview/React/Light/
//        https://js.devexpress.com/NonCommercial/
//        npm install devextreme

/*
TRANSACTION TYPE:
ID	Name
1	Blackmail
2	Payment
3	Unknown
6	Favor (quid pro quo)
8	To be investigated
*/

import React, { useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types';
import SelectEditor from '@inovua/reactdatagrid-community/SelectEditor';
/** 						Note: syntax of TSX comments
* import {
* 	TypeRowProps,
* 	TypeColumn,
* } from '@inovua/reactdatagrid-community/types'
*/
//import Select from 'react-select';
import '@inovua/reactdatagrid-community/index.css';
import Popup from './popups/PopTransaction'
import Loader from './Loader'
import getProgress from './fns/getProgress'

import { TRANSACTIONS_API_URL } from '../constants'
import { HEADER_PLUS_NAV_HEIGHT } from '../constants'
import { POPUP_PLUS_HEIGHT } from '../constants'
import { IMPORTANCE_DATA } from '../constants'

//import Country from './Country';

const gridStyle = { minHeight: window.innerHeight - HEADER_PLUS_NAV_HEIGHT - POPUP_PLUS_HEIGHT, marginTop: 0 }
//const DEFAULT_ACTIVE_CELL: [number, number] = [0, 3];
//const defaultSortInfo = { name: 'surname', dir: -1 }

const scrollProps = { alwaysShowTrack: true, autoHide: false, scrollThumbWidth: 15, scrollThumbRadius: 7, scrollThumbStyle: { background: '#17A2B8' } }
//const items = [{ country: 'United States', shortName: 'usa' }];

/* Moved to index.js import..
const importanceData = [
	{ id: '0', label: 'not set' },
	{ id: '1', label: '10%' },
	{ id: '2', label: '20%' },
	{ id: '3', label: '30%' },
	{ id: '4', label: '40%' },
	{ id: '5', label: '50%' },
	{ id: '6', label: '60%' },
	{ id: '7', label: '70%' },
	{ id: '8', label: '80%' },
	{ id: '9', label: '90%' },
	{ id: '10', label: '100%' }
]
*/
const columns = [
	{ name: 'ID', header: 'Id', defaultVisible: false, type: 'number', maxWidth: 40 },
	{ name: 'byGroupsAndIndividuals', defaultFlex: 1, header: 'By/From' },
	{ name: 'toGroupsAndIndividuals', defaultFlex: 1, header: 'To' },

	//TargetIndividualID
	{ name: 'transactionTypeId', defaultVisible: false, defaultFlex: 1, header: 'Type' },
	{ name: 'description', defaultFlex: 1, header: 'Description' },
	//{ name: 'country', header: 'Country', defaultFlex: 1,
	//  editable: (editValue) => {
	//    return Promise.resolve(editValue !== 'uk')
	//  },
	//  render: ({ value })=> flags[value] ? flags[value] : value
	//}, 
	{ 
		name: 'importance',
		header: 'Importance',
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
	{ name: 'monetaryAmount', defaultFlex: 1, header: 'Monetary $' },
	{ name: 'minFine', defaultVisible: false, defaultFlex: 1, header: 'Min Fine', type: 'number' },
	{ name: 'maxFine', defaultVisible: false, defaultFlex: 1, header: 'Max Fine', type: 'number' },
	{ name: 'minSentenceYears', defaultVisible: false, defaultFlex: 2, header: 'Min. Sentence (Yrs)', type: 'number', group: "sentence" },
	{ name: 'maxSentenceYears', defaultVisible: false, header: 'Max. Sentence (Yrs)', type: 'number' },
	{ name: 'startDate', defaultVisible: false, defaultFlex: 1, header: 'Start Date', type: 'date' },
	{ name: 'endDate', defaultVisible: false, defaultFlex: 1, header: 'End Date', type: 'date' },
	{ name: 'juristictionId', defaultVisible: false, defaultFlex: 1, header: 'Juristiction' },
	{ name: 'twitterPostUrl', defaultFlex: 1, header: 'Twitter Post URL' },
	{ name: 'youTubeUrl', defaultFlex: 1, header: 'YouTube URL' },
	{ name: 'newspaperArticleUrl', defaultFlex: 1, header: 'News Article URL' } //,
	//{ name: 'active', defaultFlex: 1, header: 'Active' }
]
/* Stacked column - maybe only works in Enterprise edition.  See: https://reactdatagrid.io/docs/stacking-columns#stacking-columns*/

/** 						Note: syntax of TSX comments
 * const groups = [
 * 	{ name: 'sentence', header: 'Sentence Years' },
 * 	{ name: 'fine', header: 'Fine' },
 * 	{ name: 'none', header: '' },
 * 	{ name: 'none2', header: '' },
 * ]
 */


//class Table extends React.Component {
const Transactions = (props) => {
	let inEdit: boolean;
	const [oldEditValue, setOldEditValue] = useState('');
	const [gridRef, setGridRef] = useState(null);
	const [dataSourceX, setDataSourceX] = useState([]);
	const [loading, setLoading] = useState(false);      //shouldn't this be true by default?
	const [loaderText, setloaderText] = useState('Loading');
	//const [user, setUser] = useState(props.user);
	const [isAuthenticated, setIsAuthenticated] = useState(props.isAuthenticated);
	const [userID, setUserID] = useState(props.userID);

	React.useEffect(() => {
		console.log("Transactions.js useEffect(): props.isAuthenticated="+ props.isAuthenticated +", props.userID="+ JSON.stringify(props.userID));	//== undefined
		if (props.isAuthenticated === undefined) {
			setIsAuthenticated(false);
		}
		else {
			setIsAuthenticated(props.isAuthenticated);
			setUserID(props.userID);
		}
	}, [props.isAuthenticated, props.userID]);

	React.useEffect(() => {
		reloadDatasource();
	}, []);						// [] stops endless reloading

	function reloadDatasource() {
		fetchData().then(res => {
			//setDataSource(res)
			setDataSourceX([].concat(res));
			props.refreshDatasource(); 	//Calls parent to refresh DataSource
			console.log('Datasource updated');
		})
		.catch(err => {
			console.error(err)
		})
	}

	const fetchData = async () => {
		setloaderText('Loading');
		setLoading(true);
		const result = await fetch(TRANSACTIONS_API_URL);
		setLoading(false);
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

		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(todoItem)       //{'id' : id, 'fieldName' : fieldName, 'val': val })
		};

		fetch(TRANSACTIONS_API_URL + '/' + id, requestOptions)
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

	//TODO: don't think I need this..
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
		setLoading(true)
		const data = [...dataSourceX];

		const dataIndexPos = data.findIndex(x => x.id === editInfo.rowId);	//Fixes inline edit issue when grid is resorted :-)

		//console.log(data)
		data[dataIndexPos] = Object.assign({}, data[dataIndexPos], { [editInfo.columnId]: editInfo.value });
		//    console.info(Object.assign({}, data[editInfo.rowIndex], { [editInfo.columnId]: editInfo.value }))
		//    console.log(editInfo.value +' - '+ editInfo.rowId)

		UpdateAPI(editInfo.rowId, editInfo.columnId, editInfo.value)
		//editInfo.columnId == table column name e.g. "Firstname"

		setDataSourceX(data);
	};

	return (
		<>
			<Popup isAuthenticated={isAuthenticated} userID={userID} refreshDatasource={() => reloadDatasource()} />

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
					sortable={true}
					//defaultSortInfo={{ name: 'surname', dir: 1 }}        //{defaultSortInfo}
					allowUnsort={false}
					scrollTopOnSort={true}
					//autoHide={false}
					scrollProps={scrollProps}
					dataSource={dataSourceX}
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

export default Transactions
