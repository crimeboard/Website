/*******************************************************************************************
* Links curve/repulsion charge - see:													   *
* https://github.com/vasturiano/3d-force-graph/blob/master/example/curved-links/index.html *
* - in essence, the link data supplied must include curve and rotation around axis.		   *
*     -> which infers: the DB/API must determine number of links between any two nodes.	   *
*******************************************************************************************/

/*******************************************************************************************
* Bezier export issue fix: 																   *
* https://gitmemory.com/issue/vasturiano/force-graph/182/826781081						   *
*******************************************************************************************/


import { Component } from "react";
//import { useRef } from "react";
//import React from "react";
//import ReactDOM from "react-dom";
import ForceGraph3D from "react-force-graph-3d";
//import ReactTooltip from "react-tooltip";
//import { Sprite, CanvasTexture, SpriteMaterial } from "three";
import SpriteText from 'three-spritetext';
import { GRAPHICS_API_URL } from "../constants";
import { HEADER_PLUS_NAV_HEIGHT } from '../constants'
import Loader from './Loader';
import PopMenu from './popups/PopMenu';
import PopMenuLink from './popups/PopMenuLink';

//See: https://codesandbox.io/s/uqel4?file=/src/index.js
//See: https://github.com/vasturiano/react-force-graph

export default class Graph extends Component {
	_isMounted = false;

	constructor(props) {
		super(props)
		//this.fgRef = React.createRef();

		this.state = {
			graphDataX: {nodes:[],links:[]},
			selectedNodeId: 0,
			selectedNode: null,
			selectedLinkId: "",
			selectedLink: null,
			activeTab: this.props.activeTab,	//TODO: NO POINT HAVING THIS CODE HERE.  WHAT DOES IT DO???
												// e.g. I AM ARE NO LONGER PAUSING THE GRAPH ANIMATION.
			
			loading: false,						//set to false, otherwise parent will keep showing spinner
			loaderText: "Loading",
			
			displayWidth: window.innerWidth,
			displayHeight: window.innerHeight - HEADER_PLUS_NAV_HEIGHT
		};
		
		this.showMenu = this.showMenu.bind(this);
		this.showMenuLink = this.showMenuLink.bind(this);
		this.dismissMenu = this.dismissMenu.bind(this);
		this.windowResize = this.windowResize.bind(this);			
		window.addEventListener('resize', this.windowResize);
		window.addEventListener("focus", this.onFocus)

	}

	windowResize() {
		this.setState({displayWidth: window.innerWidth});
		this.setState({displayHeight: window.innerHeight - HEADER_PLUS_NAV_HEIGHT});
	}

	componentDidMount() {
		this._isMounted = true; // note this flag denotes mount status
	//	console.time();
		this.fetchData()
			.then((data) => {
				if (this._isMounted) {				
					//setDataSource([].concat(res))
					this.setState({graphDataX: data});
					//console.log(data);
					console.log('Datasource updated')
					this.setState({loading: false});	//See: https://github.com/vasturiano/react-force-graph/issues/249

					this._isMounted = false;
				}
			})
			.catch(err => {
				console.error(err);
				this.setState({loading: false});
				this._isMounted = false;
			})
	//	console.timeEnd();
	}

	componentDidUpdate(prevProps) {
		if (this.props.activeTab !== prevProps.activeTab) {
			this.setState({activeTab: this.props.activeTab});
			console.log("The activeTab="+ this.props.activeTab);
			
			/* Not working and no longer needed
			if (this.fgRef != null) {
				if (this.state.activeTab !== 'graph3D' ) {
					this.fgRef.current.pauseAnimation();
					console.log("3D paused");
				}
				else {
					this.fgRef.current.resumeAnimation();
					console.log("3D resumed");
				}
			}
			*/
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.windowResize());
		window.removeEventListener("focus", this.onFocus)
		
		this._isMounted = false;
	}

	onFocus = () => {
		this.setState({activeTab: 'graph3D'});
	}
	
	fetchData = async () => {
		this.setState({loading: true});
		this.setState({loaderText: "Loading"});
		
		let result = await fetch(GRAPHICS_API_URL);
		return result.json();
	};
	
	showMenu(node, eventData, x) {	
		this.setState({selectedLinkId: ""});		//Dismiss Link menu
		this.setState(currentState => {
			console.log(eventData);
			return { selectedNodeId: node.id, selectedNode: node, menuX: eventData.pageX, menuY: eventData.pageY };
		});
	};
	showMenuLink(link, eventData, x) {				//Shows: Relative or Transaction info links
		this.setState({selectedNodeId: 0});		//Dismiss Node menu
		this.setState(currentState => {
			console.log(eventData);
			return { selectedLinkId: link.linkId, selectedLink: link, menuX: eventData.pageX, menuY: eventData.pageY };
		});
	};
	dismissMenu() {				
		this.setState(currentState => {
			return { selectedNodeId: 0, selectedLinkId: "" };
		});
	};
  
	render() {
			
		let datax = this.state.graphDataX;
		//console.log(datax);
//		let viewPortHeight = window.innerHeight - 98;	//see: https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
		
		const elem = document.getElementById('3dGraph');


		return (
			<>	
				{this.state.loading ? <Loader title={this.state.loaderText} /> : ''}

				{this.state.selectedNodeId > 0 &&
					//ReactDOM.createPortal(
						/*<div id="map-menu" style={{ position: 'relative', zIndex: 10000, left: this.state.menuX+'px', top: this.state.menuY+'px' }}>*/
						<div id="map-menu-popup" style={{ position: 'relative', zIndex: 10000 }}>
							<PopMenu node={this.state.selectedNode} close={this.dismissMenu} />
						</div>
					//	, document.getElementById('modal-root')
					//)
				}

				{this.state.selectedLinkId != "" &&
					//ReactDOM.createPortal(
						/*<div id="map-menu" style={{ position: 'relative', zIndex: 10000, left: this.state.menuX+'px', top: this.state.menuY+'px' }}>*/
						<div id="map-menu-popup" style={{ position: 'relative', zIndex: 10000 }}>
							<PopMenuLink linkId={this.state.selectedLinkId} link={this.state.selectedLink} close={this.dismissMenu} />
						</div>
					//	, document.getElementById('modal-root')
					//)
				}

				<ForceGraph3D
					id="forceGraph3D"
					//ref={this.fgRef}
					graphData={datax}
					height={this.state.displayHeight}
					width={this.state.displayWidth}
					nodeAutoColorBy="isGroup"
					nodeLabel="node"
					showNavInfo={true}
					//onEngineTick={() => this.state.loading = false}
					cooldownTime={ Infinity }		//Stops opening expansion animation from freezing
					cooldownTicks={ 100 }
					link={1}

					linkThreeObjectExtend={true}
					linkThreeObject={link => {
						// extend link with text sprite
						const sprite = new SpriteText(link.label);		//`${link.label}`

						//TODO: make clickable if link.url present or show popup if link.url = "TransId="+ tran.Id
						
						if (link.linkId.startsWith("Trans-")) {							
							sprite.color = 'orange';
						}
						else {
							sprite.color = 'lightgrey';
						}
						sprite.backgroundColor = "#00001188"
						sprite.textHeight = 2;
						
						return sprite;
					}}
					linkDirectionalArrowLength={3.5}
					linkDirectionalArrowRelPos={1}
					linkPositionUpdate={(sprite, { start, end }) => {
						//console.debug("linkPositionUpdate called");						//debug 
						const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
							[c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
						})))

						/* Rotate label along edge axis..
						let textAngle = Math.atan2(end.y - start.y, end.x - start.x);
						// maintain label vertical orientation for legibility
						if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
						if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);
						sprite.rotate(textAngle);
						*/

						// Position sprite
						Object.assign(sprite.position, middlePos)
					}}
					onLinkClick={(link, eventData) => {
						if (link.linkId.startsWith("Trans-")) {
							//console.log(link);
							//console.log(eventData);
							
							//Too many errors here?
							this.showMenuLink(link, eventData);	
						}
					}}
					onLinkHover={(link) => {
						if (this.state.loading === false) {
							if (elem != null) {
								elem.style.cursor = 'default';
								if (elem.style != null && link) {
									elem.style.cursor = 'pointer';
								}
							}
						}
					}}

					nodeThreeObjectExtend={true}
					nodeThreeObject={node => {
						if (node.id > 0){
							const sprite = new SpriteText(node.name.split(" (")[0]);
							const level = node.level > 5 ? 5 : node.level;
							sprite.color = level === 0 ? "red" : node.color;
							sprite.backgroundColor = "#00001188"
							//sprite.material.depthWrite = false; // make sprite background transparent
							sprite.textHeight = 20 - level*3;
							return sprite;
						} else {
							return false
						}
					}}
					onNodeClick={(node, eventData) => {
						//alert("Graph3D.js node="+ JSON.stringify(node));
						this.showMenu(node, eventData);	
					}}
					//linkWidth={1}				/* mention that there is a bug in library that causes slowdown */
					onNodeHover={(node) => {
						if (this.state.loading === false) {
							if (elem != null) {
								elem.style.cursor = 'default';
								if (elem.style != null && node) {
									elem.style.cursor = 'pointer';
								}
							}
						}
					}}
				/>
			</>
	  	);
	}
  }
  
  //ReactDOM.render(<Graph />, document.getElementById("root"));
  