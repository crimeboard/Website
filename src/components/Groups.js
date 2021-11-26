import { Component } from "react";
//import { useState } from "react";
import SortableTree from "react-sortable-tree";
import { Button } from "react-bootstrap";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import Popup from './popups/PopGroup'
import { GROUPS_API_URL } from "../constants";
import { Icon } from "@iconify/react";
//import plusIcon from '@iconify/icons-mdi/content-save'
import plusIcon from "@iconify/icons-mdi/plus-circle-outline";
import Loader from './Loader'


export default class Groups extends Component {

	constructor(props) {
		super(props);

		this.state = {
			treeData: [],
			isOpen: false,
			parentId: 1,
			name: "",
			description: "",
			loading: true,
			loaderText: "Loading",
			isAuthenticated: this.props.isAuthenticated,
			userID: this.props.userID
		};
	} // Constructor end

	componentDidMount() {
		this.reloadDatasource();
		this.openModal = this.openModal.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.isAuthenticated === undefined) {
			this.setState({ isAuthenticated: false });
		}
		else {
			if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
				this.setState({isAuthenticated: this.props.isAuthenticated});
				//this.state.isAuthenticated = this.props.isAuthenticated;
			}
		}
	}


	openModal = (parentID) => {
		this.setState({ parentId: parentID });
		this.setState({ isOpen: true });

		//console.log("X" + parentID);
	};
	closeModal = () => this.setState({ isOpen: false });


	reloadDatasource = () => {
		this.setState({ loaderText: "Loading" });
		this.setState({ loading: true });
		this.setState({ isOpen: false });		//close popup
		this.setState(currentState => {
			return { isOpen: false };
		});

		this.fetchData()
		.then((res) => {
			//setTreeData(res)
			//this.state.treeData = res
			//console.log(res);
			//this.setState({ treeData: res })
			//this.state = {
			//	treeData: res
			//};

			//See: https://hackernoon.com/you-might-not-need-that-recursive-function-in-javascript-275651522185
			// Create root for top-level node(s)
			const root = [];

			res.forEach((node) => {
				// No parentId means top level
				if (!node.parentId) {
					node.expanded = true;
					return root.push(node);
				}
				// Insert node as child of parent in res array
				const parentIndex = res.findIndex((el) => el.id === node.parentId);
				if (!res[parentIndex].children) {
					return (res[parentIndex].children = [node]);
				}

				res[parentIndex].children.push(node);
			});

			//console.log(root);

			this.setState({
				treeData: root, //fn
			});
			
			this.props.refreshDatasource();
			this.setState({ loading: false });
		})
		.catch((err) => {
			console.error(err);
		});

		//this.state = {
		//	treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
		//};

		//See: https://codesandbox.io/s/distracted-cannon-3pyw7?file=/src/App.js:875-945
		//		+ https://stackoverflow.com/questions/65574712/update-node-in-react-sortable-tree
		//	also: https://stackoverflow.com/questions/42167189/remove-node-in-react-sortable-tree

		//const updateTreeData = (data) => {
		//	settreeData([...data]);
		//};
	};

	fetchData = async () => {
		let result = await fetch(GROUPS_API_URL);
		// return the result
		return result.json();
	};


	//See: https://github.com/frontend-collective/react-sortable-tree/issues/80
	/* 
	addNewNode(rowInfo) {
	const NEW_NODE = { title: 'Another Node', isDirectory: true, expanded: true };
	const newTree = addNodeUnderParent({
		treeData: this.state.treeData,
		newNode: NEW_NODE,
		expandParent: true,
		parentKey: rowInfo ? rowInfo.treeIndex : undefined,
		getNodeKey: ({ treeIndex }) => treeIndex,
	});
	this.updateTreeData(newTree.treeData);
	}
	*/
	/* 
	removeNode(rowInfo) {
	const { path } = rowInfo;
	const newTree = removeNodeAtPath({
		treeData: this.state.treeData,
		path,
		getNodeKey: ({ treeIndex }) => treeIndex,
	});
	this.updateTreeData(newTree);
	}
	*/

	render() {
		return (
			<>
				<Popup isAuthenticated={this.state.isAuthenticated} userID={this.state.userID} 
						isOpen={this.state.isOpen} parentId={this.state.parentId} closeModal={() => this.closeModal()} 
						refreshDatasource={() => this.reloadDatasource()} />

				{this.state.loading ?
					<Loader title={this.state.loaderText} />
					:				
					<div className="groupContent">
						<div className="save-div-right">
							<Button variant="primary" type="button" disabled><i>Save (re-order) - not yet implemented</i></Button>
						</div>

						<SortableTree
							isVirtualized={false}
							treeData={this.state.treeData}
							getNodeKey={({ node }) => node.id}
							onChange={(treeData) => this.setState({ treeData })}
							generateNodeProps={(extendedNode) => ({
							title: (
								<a href={extendedNode.node.url}>{extendedNode.node.name}</a>
							),
							buttons: [
								<Icon
								icon={plusIcon}
								className="plus-icon"
								enabled={(this.state.isAuthenticated === true)}
								color={this.state.isAuthenticated === true ? "black" : "lightgray"}
								onClick={() => this.state.isAuthenticated === true && this.openModal(extendedNode.node.id)}
								/>,
							],
							})}
						/>
					</div>
				}
			</>
		);
	}
}
