import React, { useEffect, useRef, useState } from "react";
import { Network, DataSet } from "vis-network/standalone/umd/vis-network.min.js";
import { Toolbar } from "../../components/Toolbar.jsx";
import { DiagnosticViewer } from "../../components/DiagnosticViewer.jsx";
import "./style.css";

const DesignApp = () => {
  const leftPanelRef = useRef();
  const rightPanelRef = useRef();
  const dividerRef = useRef();
  const networkRef = useRef();
  const containerRef = useRef();
  const [draggedShape, setDraggedShape] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250); // Default left panel width
  const isDragging = useRef(false); // Track whether the divider is being dragged

  const nodes = useRef(new DataSet([]));
  const edges = useRef(new DataSet([]));
  const networkInstance = useRef(null);
  const resizeObserver = useRef(null);

  // 🛠️ Initialize the vis-network once (like componentDidMount)
  useEffect(() => {
    const container = networkRef.current;
    const data = { nodes: nodes.current, edges: edges.current };

    const options = {
      edges: { smooth: false },
      physics: { enabled: false, minVelocity: 0.75 },
      interaction: { hover: true },
      manipulation: {
        enabled: true,
        initiallyActive: true,
        addNode: false,
        addEdge: true,
        editEdge: true,
        deleteNode: true,
        deleteEdge: true,
      },
      nodes: { shape: "box" },
    };

    networkInstance.current = new Network(container, data, options);

    resizeObserver.current = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (networkInstance.current) {
          networkInstance.current.redraw();
        }
      });
    });

    resizeObserver.current.observe(container);

    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
      if (networkInstance.current) networkInstance.current.destroy();
    };
  }, []);

  // 🛠️ Handle drag start to store the dragged shape
  const handleDragStart = (e) => {
    setDraggedShape(e.target.getAttribute("data-shape"));
  };

  // 🛠️ Handle drop event on the vis-network container
  const handleDrop = (e) => {
    e.preventDefault();
    const rect = networkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const canvasPosition = networkInstance.current.DOMtoCanvas({ x, y });

    const defaultData = {
      id: (Math.random() * 1e7).toString(32),
      x: canvasPosition.x,
      y: canvasPosition.y,
      label: draggedShape || "New Node",
    };

    nodes.current.add(defaultData);
  };

  // 🛠️ Start dragging the divider
  const handleMouseDown = (e) => {
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 🛠️ Move the divider and adjust panel sizes
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const minWidth = 100; // Minimum width for left panel
    const maxWidth = containerRect.width - minWidth; // Prevent right panel from getting too small

    let newWidth = e.clientX - containerRect.left;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    setLeftPanelWidth(newWidth);
  };

  // 🛠️ End dragging the divider
  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleRun = () => {
    console.log("Run button clicked!");
  };

  const handleStop = () => {
    console.log("Stop button clicked!");
  };

  return (
    <div className="container" ref={containerRef}>
      <Toolbar onRun={handleRun} onStop={handleStop} />
      <div className="main-content">
        {/* Left Panel */}
        <div
          className="left-panel"
          ref={leftPanelRef}
          style={{ width: `${leftPanelWidth}px` }}
        >
          <h2>Layer Selection Panel</h2>
          <div className="shapes-grid">
            <div
              className="shape"
              draggable="true"
              data-shape="Input Layer"
              onDragStart={handleDragStart}
            >
              Input Layer
            </div>
            <div
              className="shape"
              draggable="true"
              data-shape="Fully Connected"
              onDragStart={handleDragStart}
            >
              FC
            </div>
            <div
              className="shape"
              draggable="true"
              data-shape="Loss Function"
              onDragStart={handleDragStart}
            >
              Loss Function
            </div>
          </div>
        </div>

        {/* Divider for resizing columns */}
        <div
          className="divider"
          ref={dividerRef}
          onMouseDown={handleMouseDown}
        ></div>

        {/* Right side container */}
        <div className="right-side" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Right Panel */}
        <div
          className="right-panel"
          ref={rightPanelRef}
        >
          <div
            id="mynetwork"
            ref={networkRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          ></div>
        </div>
        
        {/* Diagnostic Viewer below */}
        <DiagnosticViewer scriptPath="../../../../__test__/my_script.py" />
      </div>
    </div>
    </div>
  );
};

export default DesignApp;