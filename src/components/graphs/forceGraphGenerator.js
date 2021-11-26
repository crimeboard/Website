import * as d3 from "d3";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createContextMenu } from "./utils";
import styles from "./forceGraph.module.css";
import SVGgov from "../svg/government.svg";

export function runForceGraph(container,linksData,nodesData) //,	//	nodeHoverTooltip) 
{
	const links = linksData.map((d) => Object.assign({}, d));
	const nodes = nodesData.map((d) => Object.assign({}, d));

	const menuItems = [
		{
			title: "Wikipedia",
			action: (d) => {
				// TODO: add any action you want to perform
				var win = window.open(d.wikipediaUrl, '_blank');
  				win.focus();
				console.log(d);
			},
		},
		{
			title: "Description",
			action: (d) => {
				// TODO: maybe show description as tooltip?
				console.log(d);
			},
		},
	];

	let viewPortHeight = window.innerHeight - 148;	//container.viewPortHeight;
	const containerRect = container.getBoundingClientRect();
	const height = viewPortHeight;	//containerRect.height - 170;
	const width = containerRect.width;

	//const color = () => {
	//	return "#CCCCCC";
	//};
	/* 
	const icon = (d) => {
		return d.isGroup === "0" ? "\uf222" : "\uf221";
	}
	*/
	const getClass = (d) => {
		return styles.male;			//d.isGroup === "0" ? styles.male : styles.female;
	};

	const drag = (simulation) => {
		const dragstarted = (event, d) => {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		};

		const dragged = (event, d) => {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		};

		const dragended = (event, d) => {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		};

		return d3
			.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);
	};

	// Add the tooltip element to the graph
	const tooltip = document.querySelector("#graph-tooltip");
	if (!tooltip) {
		const tooltipDiv = document.createElement("div");
		tooltipDiv.classList.add(styles.tooltip);
		tooltipDiv.style.opacity = "0";
		tooltipDiv.id = "graph-tooltip";
		document.body.appendChild(tooltipDiv);
	}
	const div = d3.select("#graph-tooltip");

	const addTooltip = (hoverTooltip, d, x, y) => {
		div.transition().duration(200).style("opacity", 0.9);
		div
			.html(hoverTooltip(d))
			.style("left", `${x}px`)
			.style("top", `${y - 28}px`);
	};

	const removeTooltip = () => {
		div.transition().duration(200).style("opacity", 0);
	};

	const simulation = d3
		.forceSimulation(nodes)
		.force(
			"link",
			d3.forceLink(links).id((d) => d.id)
		)
		.force("charge", d3.forceManyBody().strength(-200))
		.force("x", d3.forceX())
		.force("y", d3.forceY());

	const svg = d3
		.select(container)
		.append("svg")
		.attr("id", "graphSvg")
		.attr("viewBox", [-viewPortHeight / 2, -width / 2,  viewPortHeight, width])
		.call(
			d3.zoom().on("zoom", function () {
				svg.attr("transform", d3.event.transform);
			})
		);

	//		console.log(nodes);
	/*	
	const link = svg.append("g")
	.selectAll('.link')
	.data(links)
	.enter().append('line')
	.attr("class","link");
 */
	const link = svg
		.append("g")
		.attr("stroke", "#00F")
		.attr("stroke-opacity", 1)
		.selectAll("line")
		.data(links)
		.join("line")
		.attr("stroke-width", 1); //d => Math.sqrt(d.value));

	const node = svg
		.append("g")
		.attr("stroke", "#fff")
		.attr("stroke-width", 2)
		.selectAll("circle")
		.data(nodes)
		.join("circle")
		.on("contextmenu", (d) => {
			createContextMenu(d, menuItems, width, height, "#graphSvg");
		})
		.attr("r", function (d) {
			return 16 - 3 * d.level;
		})
		.attr("fill", function (d) {
			return d.level == 0 ? "red" : "#CCCCCC";
		})
		//
		//.attr("fill", color)
//		.call(drag(simulation));

	node
		.append("image")
		.attr("xlink:href", function (d) {
			return d.imageUrl;
		})
		.attr("x", "-12px")
		.attr("y", "-12px")
		.attr("width", "24px")
		.attr("height", "24px")
		.data(nodes);

	/* 
	const label = svg.append("g")
		.attr("class", "labels")
		.selectAll("text")
		.data(nodes)
		.enter()
		.append("text")
		.on('contextmenu', (d) => {
			createContextMenu(d, menuItems, width, height, '#graphSvg');
		})
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr("class", d => `fa ${getClass(d)}`)
		.attr('font-family', 'FontAwesome')
		.text(d => {return "icon(d)";})
		.call(drag(simulation));
*/

	/*
nodeEnter.append("image")
.attr("xlink:href", function(d) { return d.imageUrl; })
.attr("x", "-12px")
.attr("y", "-12px")
.attr("width", "24px")
.attr("height", "24px");
*/
	const label = svg
		.append("g")
		.attr("class", "labels")
		.selectAll("text")
		.data(nodes)
		.enter()
		.append("text")
		.on("contextmenu", (d) => {
			createContextMenu(d, menuItems, width, height, "#graphSvg");
		})
		.attr("text-anchor", "middle")
		.attr("fill", "black")
		.attr("font-size", function (d) {
			return 17 - 2 * d.level + "px";
		})
		.attr("dominant-baseline", "central")
		//.attr("class", d => `fa ${getClass(d)}`)
		.text((d) => {
			return d.name.split(" (")[0];
		}) //remove text in brackets to keep labels concise
		.call(drag(simulation));

	label
		.on("mouseover", (d) => {
			//	addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
		})
		.on("mouseout", () => {
			removeTooltip();
		});

	simulation.on("tick", () => {
		//update link positions
		link
			.attr("x1", (d) => d.source.x)
			.attr("y1", (d) => d.source.y)
			.attr("x2", (d) => d.target.x)
			.attr("y2", (d) => d.target.y);

		// update node positions
		node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

		// update label positions
		label
			.attr("x", (d) => {
				return d.x;
			})
			.attr("y", (d) => {
				return d.y;
			});
	});

	return {
		destroy: () => {
			simulation.stop();
		},
		nodes: () => {
			return svg.node();
		},
	};
}
