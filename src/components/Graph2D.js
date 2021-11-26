/*******************************************************************************************
* Bezier export issue fix: 																   *
* https://gitmemory.com/issue/vasturiano/force-graph/182/826781081						   *
*******************************************************************************************/

import { Component, createRef } from "react";
//import ReactDOM from "react-dom";
import ForceGraph2D from "react-force-graph-2d";
//import ReactTooltip from "react-tooltip";
//import { Sprite, CanvasTexture, SpriteMaterial } from "three";
//import SpriteText from 'three-spritetext';
import { GRAPHICS_API_URL } from "../constants";
import { HEADER_PLUS_NAV_HEIGHT } from '../constants'
//import { TRANSACTIONS_API_URL } from "../constants";
//import SpriteText from 'three-spritetext';
import Loader from './Loader'
import PopMenu from './popups/PopMenu';
import PopMenuLink from './popups/PopMenuLink';
//	import {createContextMenu} from './menu/contextMenuFactory.js'
//	import {menuItems} from './menu/menuItems.js'
import * as d3 from "d3";

//See: https://codesandbox.io/s/uqel4?file=/src/index.js
//See: https://github.com/vasturiano/react-force-graph

//TODO: Highlight links on node hover: https://vasturiano.github.io/react-force-graph/example/highlight/


export default class GraphD2 extends Component {
	_isMounted = false;

	constructor(props) {
		super(props)
		this.forceRef = createRef();

		this.state = {
			graphDataX: {nodes:[],links:[]},
			selectedNodeId: 0,
			selectedNode: null,
			selectedLinkId: "",
			selectedLink: null,

			loading: false,						//set to false, otherwise parent will keep showing spinner
			loaderText: "Loading",
			activeTab: this.props.activeTab,
			
			menuX: 0,
			menuY: 0,
			
			displayWidth: window.innerWidth,
			displayHeight: window.innerHeight - HEADER_PLUS_NAV_HEIGHT
		};

		this.showMenu = this.showMenu.bind(this);
		this.dismissMenu = this.dismissMenu.bind(this);
		this.windowResize = this.windowResize.bind(this);
		this.windowResize = this.windowResize.bind(this);
		window.addEventListener('resize', this.windowResize);
	}
	/*
	const [displayWidth, setDisplayWidth] = useState(window.innerWidth);
	const [displayHeight, setDisplayHeight] = useState(window.innerHeight);
	
	*/

	windowResize() {
		this.setState({displayWidth: window.innerWidth});
		this.setState({displayHeight: window.innerHeight - HEADER_PLUS_NAV_HEIGHT});
	}

	componentDidMount() {
		this._isMounted = true; // note this flag denote mount status

		this.fetchData()
			.then((data) => {
			if (this._isMounted) {				
				//setDataSource([].concat(res))

				this.forceRef.current.d3Force("link")
					.id((d) => d.id)
					.distance(() => 50)
					.strength(1);
				//.linkColor(() => "blue")
				//.distance(link => ...)
  				//.strength(link => ...)
				this.forceRef.current.d3Force("charge").strength(-300);
				this.forceRef.current.d3Force("x", d3.forceX());
				this.forceRef.current.d3Force("y", d3.forceY());

				//this.forceRef.current.d3Force("node").
				/*
				this.forceRef.current.d3Force("node")					
					.on('contextmenu', (d) => {
						createContextMenu(d, menuItems, width, height, '#graphSvg');
					})
				*/
				this.setState({graphDataX: data});
				//console.log(data);
				console.log('Datasource updated');
				this.setState({loading: false});
				
				this._isMounted = false;
			}
		})
		.catch(err => {
			console.error(err)
			this.setState({loading: false});
			this._isMounted = false;
		})
	}
	
	componentDidUpdate(prevProps) {
		if (this.props.activeTab !== prevProps.activeTab) {
			this.setState({activeTab: this.props.activeTab});
			console.log("The activeTab="+ this.props.activeTab);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.windowResize());
		window.removeEventListener("focus", this.onFocus)

		this._isMounted = false;
	}
	
	fetchData = async () => {
		this.setState({loading: true});
		this.setState({loaderText: "Loading"});
		
		let result = await fetch(GRAPHICS_API_URL);
		return result.json();
	};

	
	showMenu(node, eventData) {	
		this.setState(currentState => {
			//console.log(eventData);
			return { selectedNodeId: node.id, selectedNode: node, menuX: eventData.pageX-55, menuY: eventData.pageY-85 };
		});
	};
	showMenuLink(link, eventData) {	
		this.setState(currentState => {
			//console.log(eventData);
			return { selectedLinkId: link.linkId, selectedLink: link, menuX: eventData.pageX-55, menuY: eventData.pageY-85 };
		});
	};
	dismissMenu() {			
		this.setState(currentState => {
			return { selectedNodeId: 0, selectedLinkId: "" };
		});
	};

	/*
	createSVGtext(caption, x, y) {
		//  This function attempts to create a new svg "text" element, chopping 
		//  it up into "tspan" pieces, if the caption is too long
		//
		var svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		svgText.setAttributeNS(null, 'x', x);
		svgText.setAttributeNS(null, 'y', y);
		svgText.setAttributeNS(null, 'font-size', 12);
		svgText.setAttributeNS(null, 'fill', '#FFFFFF');         //  White text
		svgText.setAttributeNS(null, 'text-anchor', 'middle');   //  Center the text
	
		//  The following two variables should really be passed as parameters
		var MAXIMUM_CHARS_PER_LINE = 20;
		var LINE_HEIGHT = 16;
	
		var words = caption.split(" ");
		var line = "";
	
		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + " ";
			if (testLine.length > MAXIMUM_CHARS_PER_LINE)
			{
				//  Add a new <tspan> element
				var svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
				svgTSpan.setAttributeNS(null, 'x', x);
				svgTSpan.setAttributeNS(null, 'y', y);
	
				var tSpanTextNode = document.createTextNode(line);
				svgTSpan.appendChild(tSpanTextNode);
				svgText.appendChild(svgTSpan);
	
				line = words[n] + " ";
				y += LINE_HEIGHT;
			}
			else {
				line = testLine;
			}
		}
	
		var svgTSpan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
		svgTSpan2.setAttributeNS(null, 'x', x);
		svgTSpan2.setAttributeNS(null, 'y', y);
	
		var tSpanTextNode2 = document.createTextNode(line);
		svgTSpan2.appendChild(tSpanTextNode2);
	
		svgText.appendChild(svgTSpan);
	
		return svgText;
	}
	*/
	
	render() {
			
		let datax = this.state.graphDataX;
		//console.log(datax);
//		let viewPortHeight = window.innerHeight - 98;	//see: https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
		
		/* 
		const [displayWidth, setDisplayWidth] = useState(window.innerWidth);
		const [displayHeight, setDisplayHeight] = useState(window.innerHeight - 98);
		
		window.addEventListener('resize', () => {
		  setDisplayWidth(window.innerWidth);
		  setDisplayHeight(window.innerHeight);
		});
		*/

		const elem = document.getElementById('graphSvg');


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

				{this.state.selectedLinkId !== "" &&
					//ReactDOM.createPortal(
						/*<div id="map-menu" style={{ position: 'relative', zIndex: 10000, left: this.state.menuX+'px', top: this.state.menuY+'px' }}>*/
						<div id="map-menu-popup" style={{ position: 'relative', zIndex: 10000 }}>
							<PopMenuLink linkId={this.state.selectedLinkId} link={this.state.selectedLink} close={this.dismissMenu} />
						</div>
					//	, document.getElementById('modal-root')
					//)
				}

				<ForceGraph2D 
					id="forceGraph2D"
					ref={this.forceRef}
					graphData={datax}
					height={this.state.displayHeight}
					width={this.state.displayWidth}
					backgroundColor="white"

					//nodeLabel="XXXX"
					showNavInfo={true}
					//linkOpacity={1}
					linkWidth="2"
					forceManyBody={true}
					cooldownTime={ Infinity }		//Stops opening expansion animation from freezing
					cooldownTicks={ 100 }
					autoPauseRedraw={true}			//Only works on 2D (Canvas)

					//nodeCanvasObjectMode={node => 'after'}
					nodeCanvasObject={(node, ctx, globalScale) => {
						//console.log(node.name);
						const label = node.name.split(" (")[0];
						if (label.trim() === '') {
							return;
						}

						let fontSize = (20-node.level*2); // / (globalScale*2);
						ctx.font = `${fontSize}px "Orbitron,sans-serif"`;
						//ctx.classClass = "node2D";
						const textWidth = ctx.measureText(label).width;
						let bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
						
						if (node.level < 1) {
							const fontSizeTopLevel = (20-node.level*2);
							ctx.font = `${fontSizeTopLevel}px "Segoe UI"`;
							bckgDimensions = [textWidth, fontSizeTopLevel].map(n => n + fontSizeTopLevel * 0.2);

							ctx.fillStyle = 'rgba(255, 0, 0, 1)';
							//ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
							
							ctx.beginPath();
							ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI, false);
							ctx.fill();						
						}
						else {
							fontSize = 16 - 3 * node.level;
							ctx.beginPath();
							ctx.arc(node.x, node.y, fontSize, 0, 2 * Math.PI, false);
							ctx.fillStyle = '#CCC';
							ctx.fill();
						}
						ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						ctx.fillStyle = node.color;
						ctx.class = "wrapTitle";				//TODO: doesn't work!
						ctx.style = "max-width: 70px";			//TODO: doesn't work!
						ctx.width = textWidth;
						ctx.height = fontSize;
						/*
						const strs = label.split(" ");
						const lines = strs.length;
						if (lines == 1) {
							ctx.fillText(label, node.x, node.y);
						}
						else {
							let topOffset = -fontSize - 2;
							strs.forEach(element => {
								ctx.fillText(element, node.x, node.y + topOffset);
								topOffset += fontSize + 2;
							});
						}
						*/
						//ctx.fillText(label, node.x, node.y, 25);
						ctx.fillText(label, node.x, node.y);
						node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
					}}
					//nodeVal={25}
					onNodeClick={(node, eventData) => {
						//console.log(node);

						this.showMenu(node, eventData);

						//const containerRect = this.container.getBoundingClientRect();
						//	const height = window.innerHeight - 148; //containerRect.height;
						//	const width = window.width; //containerRect.width;
						//	createContextMenu(datax, event, menuItems, width, height, '#graphSvg');
					}}
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

					linkColor="blue"					
					//TODO: maybe 2D doesn't support labels or my adaptation is wrong
					/*
					linkLabel={link => {
						return "XXXXX";	//link.label;
					}}
					*/

					linkDirectionalArrowLength={3.5}
					linkDirectionalArrowRelPos={1}

					//vasturiano: if you are in 2d mode, make sure to use nodeCanvasObject, not nodeThreeObject

					//IMPORTANT: Re-write using this example: https://vasturiano.github.io/force-graph/example/text-links/
					linkCanvasObjectMode={(() => 'after')}
					linkCanvasObject={((link, ctx) => {
						const MAX_FONT_SIZE = 4;
						const LABEL_NODE_MARGIN = 4; //Graph.nodeRelSize() * 1.5;
			
						const start = link.source;
						const end = link.target;
			
						// ignore unbound links
						if (typeof start !== 'object' || typeof end !== 'object' || link.label === "") return;
			
						// calculate label positioning
						const textPos = Object.assign(...['x', 'y'].map(c => ({
							[c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
						})));
			
						const relLink = { x: end.x - start.x, y: end.y - start.y };
			
						const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;
			
						let textAngle = Math.atan2(relLink.y, relLink.x);
						// maintain label vertical orientation for legibility
						if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
						if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);
			
						const label = `${link.label}`;
			
						// estimate fontSize to fit in link length
						ctx.font = '12px "Orbitron,sans-serif"';
						const fontSize = 3 * Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width);
						ctx.font = `${fontSize}px "Orbitron,sans-serif"`;
						const textWidth = ctx.measureText(label).width;
						const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
			
						// draw text label (with background rect)
						ctx.save();
						ctx.translate(textPos.x, textPos.y);
						ctx.rotate(textAngle);
			
						ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
						ctx.fillRect(- bckgDimensions[0] / 2, - bckgDimensions[1] / 2, ...bckgDimensions);
			
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						if (link.linkId.startsWith("Trans-")) {
							ctx.fillStyle = 'orange';
						}
						else {
							ctx.fillStyle = 'darkgrey';
						}
						ctx.fillText(label, 0, 0);
						ctx.restore();
					})}

					/*
					linkPositionUpdate={(link, { start, end }) => {
						const textPos = Object.assign({},...['x', 'y'].map(c => ({
							[c]: start[c] + (end[c] - start[c]) / 2 		// calc middle point
						})));
						console.log(textPos);
					  	// Position sprite
					  	//Object.assign(sprite.position, textPos);
					}}
					*/
					/*
					linkPointerAreaPaint={(link, color, ctx, globalContext) => {		//For label click event..
						ctx.fillStyle = color;
						const bckgDimensions = link.__bckgDimensions;
						bckgDimensions && ctx.fillRect(link.x - bckgDimensions[0] / 2, link.y - bckgDimensions[1] / 2, ...bckgDimensions);
					}}
					*/
					onLinkClick={(link, eventData) => {
						//console.log(link.label);
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
					
				/>
				<div className="scene-nav-info scene-nav-info-2">
					x
				</div>
			</>
	  	);

			
		//const forceGraph2D = document.getElementById('forceGraph2D');
			
		//this.state.activeTab === 'graph2D' ? forceGraph2D.resumeAnimation() : forceGraph2D.pauseAnimation();
	}
  }
  
  //ReactDOM.render(<GraphD2 />, document.getElementById("root"));
  