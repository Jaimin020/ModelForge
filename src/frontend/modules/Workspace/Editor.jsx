import React, { useEffect, useRef, useState } from "react";
import { Network, DataSet } from "vis-network/standalone/umd/vis-network.min.js";
import { Toolbar } from "../../components/Toolbar.jsx";
import { DiagnosticViewer } from "../../components/DiagnosticViewer.jsx";
import { ParameterViewer } from "../../components/ParameterViewer.jsx";
import { LayerSelectionPanel} from "../LayerSelectionPanel/LayerSelectionPanel.jsx"
import { getNodeByName } from "../../utils/nodeOps/getNodeByName.jsx";
import { ModelNodeManager } from "../../utils/graphMngr/ModelNodeManager.ts";
import { CycleDetector } from "../../utils/graphUtils/CycleDetector.ts";
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

  // Add state for selected node
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeManager = ModelNodeManager.getInstance();

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
        addEdge: (data,callback) => {
          callback(data);
        },
        enabled: true,
        initiallyActive: true,
        addNode: false,
        //addEdge: true,
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

    networkInstance.current.on('select', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodes.current.get(nodeId);
        setSelectedNode(node);
      } else {
        setSelectedNode(null);
      }
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
  const handleDrop = async (e) => {
    e.preventDefault();
    const rect = networkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const canvasPosition = networkInstance.current.DOMtoCanvas({ x, y });

    const defaultData = {
      id: (Math.random() * 1e7),
      x: canvasPosition.x,
      y: canvasPosition.y,
      label: draggedShape || "New Node",
    };
    const data = await getNodeByName(defaultData.label);
    nodeManager.createNode(defaultData.id,{
      name: data.name,
      feature: data.feature,
      library: data.library,
      framework: data.framework,
      codeId: data.codeId,
      inport: data.inport,
      outport: data.outport,
      parameters: data.parameters,
      code: data.code,
    })
    nodes.current.add(defaultData);

    //set Node param valeues
    //setNodeParamValues(defaultData.id, defaultData.label);
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
    //check for graph.
    const currentEdges = edges.current.get();
    const cycleDetector = new CycleDetector([...currentEdges]);
    const isExcutable = true;
    const isCyclic = cycleDetector.hasCycle();
    setOutput("Analysing Model\n");
    const cycleDia = isCyclic?"Yes":"No"
    setOutput(prev => prev + "Cycle Detected: " + cycleDia + "\n");
    if(isExcutable && !isCyclic)
    {
      executePythonScript();
    }
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
          <LayerSelectionPanel onDragStart={handleDragStart} />
          <ParameterViewer selectedNode={selectedNode} />
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