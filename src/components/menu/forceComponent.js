import React, { useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import ReactDOM from "react-dom";
import { NavLink } from "react-bootstrap";

const ForceComponent = ({ eventData }) => {
  const [selectedNodeId, setSelectedNodeId] = useState(0);

  const onNodeClick = (node) => {
    setSelectedNodeId(node.id);
  };

  return (
    <div>
      {selectedNodeId &&
        ReactDOM.createPortal(
          <div style={{ zIndex: 1 }}>
            <div>NODE MENU</div>
            <div>Menu item 1</div>
            <div>Menu item 2</div>
            <button onClick={() => setSelectedNodeId(0)}>Close</button>
          </div>,
          document.body
        )}
      <ForceGraph3D onNodeClick={onNodeClick} />
    </div>
  );
};

export default ForceComponent;