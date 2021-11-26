//Maybe use this instead: https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/Overview/React/Light/
//        https://js.devexpress.com/NonCommercial/
//        npm install devextreme

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
import '@inovua/reactdatagrid-community/index.css';
import Popup from './popups/PopRelationships'  //NEED TO FIX
import Loader from './Loader'

import { RELATIONSHIP_API_URL } from '../constants'
import { HEADER_PLUS_NAV_HEIGHT } from '../constants'
import { POPUP_PLUS_HEIGHT } from '../constants'
//import Country from './Country';

const gridStyle = { minHeight: window.innerHeight - HEADER_PLUS_NAV_HEIGHT - POPUP_PLUS_HEIGHT, marginTop: 0 }
//const DEFAULT_ACTIVE_CELL: [number, number] = [0, 1];
//const defaultSortInfo = { name: 'surname', dir: -1 }

const scrollProps = { alwaysShowTrack: true, autoHide: false, scrollThumbWidth: 15, scrollThumbRadius: 7, scrollThumbStyle: { background: '#17A2B8' } }
//const items = [{ country: 'United States', shortName: 'usa' }];

export const RELATIONSHIP_DATA = [
	{ id: '0', label: 'Unassigned' },
	{ id: '1', label: 'Owner' },
	{ id: '2', label: 'Business Partner' },
	{ id: '3', label: 'Employee' },

	{ id: '4', label: 'Friendship' },
	{ id: '5', label: 'Married' },
	{ id: '6', label: 'Boyfriend/Girlfriend' },
	{ id: '7', label: 'Son/Daughter of' },
	{ id: '8', label: 'Family Relative' },
	{ id: '9', label: 'Funded/Payed' },

	{ id: '10', label: 'President/PM' },
	{ id: '11', label: 'King/Queen/Monarchy' },
	{ id: '12', label: 'Government Official' },

	{ id: '13', label: 'Member' },
	{ id: '14', label: 'Sponsor' },
	{ id: '15', label: 'Affiliate' }
];

const columns = [
	//{ name: 'groupId', defaultVisible: false, defaultFlex: 1, header: 'Group' },
	{ name: 'byGroupsAndIndividuals', defaultFlex: 1, header: 'Group or Individual' },  //
	//{ name: 'individualId', defaultVisible: false, defaultFlex: 1, header: 'Individual' },
	{ name: 'toGroupsAndIndividuals', defaultFlex: 1, header: 'Individual' },
	//{ name: 'relationshipId', defaultVisible: false, defaultFlex: 1, header: 'Relationship' },
	//{ name: 'relationshipType', defaultFlex: 1, header: 'Relationship', render: ({ value }) => relationType[value] },
	{ 
		name: 'relationshipType',
		header: 'Relationship',
		defaultFlex: 1,
		width: 100,
		sortable: true,
		sort: (p1, p2) => RELATIONSHIP_DATA[p1].label.localeCompare(RELATIONSHIP_DATA[p2].label),
		render: ({ value }) => RELATIONSHIP_DATA[value].label,
		editor: SelectEditor,
		editorProps: {
			idProperty: 'id',
			dataSource: RELATIONSHIP_DATA,
			collapseOnSelect: true,
			clearIcon: null
		}
	},	
	{ name: 'description', defaultFlex: 1, header: 'Description' },
	{ name: 'started', defaultFlex: 1, header: 'Started', type: 'date' },
	{ name: 'ended', defaultFlex: 1, header: 'Ended', type: 'date' }
]



//class Table extends React.Component {
const Relationships = (props) => {
	let inEdit: boolean;
	const [oldEditValue, setOldEditValue] = useState('');
	const [gridRef, setGridRef] = useState(null);
	const [dataSourceX, setDataSourceX] = useState([]);
	const [loading, setLoading] = useState(false);      //shouldn't this be true by default?
	const [loaderText, setloaderText] = useState('Loading');
//	const [user, setUser] = useState(props.user);
	const [isAuthenticated, setIsAuthenticated] = useState(props.isAuthenticated);
	const [userID, setUserID] = useState(props.userID);

	React.useEffect(() => {
		console.log("Relationships.js useEffect(): props.isAuthenticated="+ props.isAuthenticated +", props.userID="+ JSON.stringify(props.userID));	//== undefined
		if (props.isAuthenticated === undefined) {
			setIsAuthenticated(false);
		}
		else {
			setIsAuthenticated(props.isAuthenticated);
			setUserID(props.userID);
		}
	}, [props.isAuthenticated, props.userID]);

	React.useEffect(() => {
		fetchData().then(res => {
			setDataSourceX(res)			
			setLoading(false);
		})
		.catch(err => {
			console.error(err)
		})
	}, [])
	//console.log(dataSourceX)
	

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
		fetch(RELATIONSHIP_API_URL + '/' + id, requestOptions)
			.then(response => response.json())
			.catch(err => console.log(err))
			.then(
				//data => this.setState({ id: data.id })
				() => setLoading(false)
			);
	}

	const fetchData = async () => {
		setloaderText('Loading');
		setLoading(true);
		const result = await fetch(RELATIONSHIP_API_URL);
		return result.json();
	};

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

	function reloadDatasource() {
		fetchData().then(res => {
			//setDataSource(res)
			setDataSourceX([].concat(res));
			props.refreshDatasource();
			setLoading(false);
			console.log('Datasource updated');
		})
		.catch(err => {
			console.error(err)
		})

		//const data = [...dataSource];

		//setDataSource(data);
	} //, [dataSource])

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

export default Relationships
