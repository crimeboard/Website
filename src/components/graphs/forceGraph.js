import React from "react";
import { runForceGraph } from "./forceGraphGenerator";
import { GRAPHICS_API_URL } from "../../constants";
import styles from "./forceGraph.module.css";

export function Graph2D({ nodeHoverTooltip }) {
	const containerRef = React.useRef(null);
	let linksData = [];
	let nodesData = [];

	React.useEffect(() => {
		let destroyFn;
		fetchData()
			.then((res) => {
				linksData = res.links.map((d) => Object.assign({}, d));
				nodesData = res.nodes.map((d) => Object.assign({}, d));
			})
			.then(() => {
				if (containerRef.current) {
					const { destroy } = runForceGraph(
						containerRef.current,
						linksData,
						nodesData,
						nodeHoverTooltip
					);
					destroyFn = destroy;
				}
			})
			.catch((err) => {
				console.error(err);
			});

		return destroyFn;
	}, []);

	return <div ref={containerRef} className={styles.container} />;
}

const fetchData = async () => {
	const result = await fetch(GRAPHICS_API_URL);
	//	
	return result.json();
};
