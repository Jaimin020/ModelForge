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

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // 🛠️ Initialize the vis-network once (like componentDidMount)
  useEffect(() => {
    const container = networkRef.current;
    const data = { nodes: nodes.current, edges: edges.current };

    const options = {
      edges: { smooth: false,
          arrows: 'to',
       },
      physics: { enabled: false, minVelocity: 0.75 },
      interaction: { 
        hover: true,
        zoomView: true,
        navigationButtons: false,
        keyboard: true,
        zoomSpeed: 1,    // Zoom speed multiplier
      },
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

  const executePythonScript = async () => {
    if (isRunning) {
      setOutput((prev) => prev + "\nProcess already running. Please wait.");
      return;
    }
    
    setOutput("Analysing...\n");
    setIsRunning(true);
  
    try {
      window.dialog.onDialogUpdate((message) => {
        setOutput((prevOutput) => prevOutput + message);
      });
      
      await window.api.runPython("src/__tests__/my_script.py");
    } catch (error) {
      setOutput((prevOutput) => prevOutput + `\n${error}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Update handleRun
  const handleRun = () => {
    executePythonScript();
  };
  

  const handleStop = async () => {
    if (isRunning) {
      await window.api.stopPython();
      setIsRunning(false);
      setOutput(prev => prev + '\nProcess stopped by user.');
    }
  };

  return (
    <div className="container" ref={containerRef}>
      <Toolbar onRun={handleRun} onStop={handleStop} isRunning={isRunning} />
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
        <DiagnosticViewer output={output} />
      </div>
    </div>
    </div>
  );
};

export default DesignApp;