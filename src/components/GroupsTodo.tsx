//Maybe use this instead: https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/Overview/React/Light/
//        https://js.devexpress.com/NonCommercial/
//        npm install devextreme

//TODO: loader spinner not shown e.g. empty table gets shown until API loading completes

//npm install react-sortable-tree --save

import React, { useState, useCallback, Component } from 'react'
//import ReactDataGrid from '@inovua/reactdatagrid-community'
import SortableTree from 'react-sortable-tree';
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types'
import {
	TypeRowProps,
	TypeColumn,
} from '@inovua/reactdatagrid-community/types'
import '@inovua/reactdatagrid-community/index.css'
import Popup from './popups/PopGroup'
import Loader from './Loader'
import { GROUPS_API_URL } from '../constants'

/* 
function UpdateAPI(id:string, fieldName:string, newValue:string) {
  console.log(newValue);
  let todoItem = {
	id: id,
	fieldName: fieldName,
	newValue: newValue,
	userID: 1
  };

  const requestOptions = {
	method: 'PUT',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(todoItem)       //{'id' : id, 'fieldName' : fieldName, 'val': val })
  };
  fetch(GROUPS_API_URL +'/'+ id, requestOptions)
	.then(response => response.json())
	.catch(err => console.log(err))
	//.then(data => this.setState({ id: data.id }))
	;
}
*/







//Re-write TSX using interfaces: https://stackoverflow.com/questions/46987816/using-state-in-react-with-typescript/46987987
interface IProps {
}

interface IState {
	treeData?: [];
}

export default class Tree extends Component<IProps, IState> {
	fetchData = async () => {
		let result = await fetch(GROUPS_API_URL);
		// return the result
		return result.json();
	};

	constructor(props) {
		super(props);

		this.state = {
			treeData: []
		};
		//this.state = {treeData: new Array};

		//const [treeData, setTreeData] = useState([]);
		//const [loading, setLoading] = useState(true);      //shouldn't this be true by default?
		//const [isOpen, setIsOpen] = useState(false);      //Modal

		//setLoading(true)
		this.fetchData().then(res => {
			//setTreeData(res)
			//this.state.treeData = res
			console.log(res)
			this.setState({ treeData: res })
			console.log(this.state.treeData)
		})
			.catch(err => {
				console.error(err)
			})
		//setLoading(false) 

		//this.state = {
		//  treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
		//};

	}

	render() {
		return (
			<div style={{ height: 400 }}>
				<SortableTree
					isVirtualized={false}
					treeData={this.state.treeData}
					onChange={treeData => this.setState({ treeData })}
				/>
			</div>
		);
	}
}
