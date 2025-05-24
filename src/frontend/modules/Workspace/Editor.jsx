import React, { useEffect, useRef, useState } from 'react';
import {
  Network,
  DataSet,
} from 'vis-network/standalone/umd/vis-network.min.js';
import { Toolbar } from '../../components/Toolbar.jsx';
import { DiagnosticViewer } from '../../components/DiagnosticViewer.jsx';
import { ParameterViewer } from '../../components/ParameterViewer.jsx';
import { LayerSelectionPanel } from '../LayerSelectionPanel/LayerSelectionPanel.jsx';
import { getNodeByName } from '../../utils/nodeOps/getNodeByName.jsx';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager.ts';
import { GraphAnalyzer } from '../../utils/graphMngr/GraphAnalyzer.ts';
import { ModelInputModal } from '../../components/ModelInputModal.jsx';
import { HyperparameterModal } from '../../components/HyperparameterModal';
import { GraphDataManager } from '../../utils/graphUtils/GraphDataManager.ts';
import { LoadingOverlay } from '../Loading/LoadingModal.jsx';
import { FooterLine } from '../Footer/FooterLine.jsx';
import { openNewWindow } from '../../utils/windowUtils/windowUtils';
import { TEST_PY_FILE } from '../../../envPath.js';
import Convert from 'ansi-to-html';
import './style.css';
// For error and message strings
import {
  editorMessages,
  editorErrors,
} from '../../utils/strings/editorStrings.js';
import { separators } from '../../utils/strings/constants.js';
import { loaderMessages } from '../../utils/strings/loaderStrings.js';

const DesignApp = () => {
  const leftPanelRef = useRef();
  const rightPanelRef = useRef();
  const dividerRef = useRef();
  const networkRef = useRef();
  const containerRef = useRef();
  const [draggedShape, setDraggedShape] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250); // Default left panel width
  const [layerSelectionHeight, setLayerSelectionHeight] = useState(300); // Default height
  const isDragging = useRef(false); // Track whether the divider is being dragged

  const nodes = useRef(new DataSet([]));
  const edges = useRef(new DataSet([]));
  const networkInstance = useRef(null);
  const resizeObserver = useRef(null);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Save Path
  const pathToSaveRef = useRef(null);

  // Add state for selected node
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeManager = ModelNodeManager.getInstance();
  const graphManager = GraphDataManager.getInstance();

  const [isInputNode, setIsInputNode] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isHyperParamModalOpen, setIsHyperParamModalOpen] = useState(false);

  // Add at the top of component
  const convert = new Convert({ newline: true });

  //Loaing overlay message
  const [loadingMessage, setLoadingMessage] = useState('');

  //FrameWork Info
  const [activeFramework, setActiveFramework] = useState('PyTorch');

  // 🛠️ Initialize the vis-network once (like componentDidMount)
  useEffect(() => {
    const container = networkRef.current;
    const data = { nodes: nodes.current, edges: edges.current };

    const options = {
      edges: { smooth: false, arrows: 'to' },
      physics: { enabled: false, minVelocity: 0.75 },
      interaction: {
        hover: true,
        zoomView: true,
        navigationButtons: false,
        keyboard: true,
        zoomSpeed: 1, // Zoom speed multiplier
      },
      manipulation: {
        addEdge: (data, callback) => {
          callback(data);
        },
        enabled: true,
        initiallyActive: true,
        addNode: false,
        //addEdge: true,
        editEdge: true,
        deleteNode: (data, callback) => {
          setSelectedNode(null);
          setIsInputModalOpen(null);
          nodeManager.deleteNode(data.nodes[0]);
          callback(data);
        },
        deleteEdge: true,
      },
      nodes: { shape: 'box' },
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
        // Check if selected node is input type
        const modelNode = nodeManager.getNode(nodeId);
        setIsInputNode(modelNode?.feature?.toLowerCase().includes('input'));
      } else {
        setSelectedNode(null);
        setIsInputNode(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        if (networkInstance.current) {
          networkInstance.current.fit();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (networkInstance.current) {
          onSave();
        }
      }
    });

    resizeObserver.current.observe(container);

    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
      if (networkInstance.current) networkInstance.current.destroy();
      document.removeEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
          e.preventDefault();
          if (networkInstance.current) {
            networkInstance.current.fit();
          }
        }
      });
    };
  }, []);

  // 🛠️ Handle drag start to store the dragged shape
  const handleDragStart = (e) => {
    setDraggedShape(e.target.getAttribute('data-shape'));
  };

  // 🛠️ Handle drop event on the vis-network container
  const handleDrop = async (e) => {
    e.preventDefault();
    const rect = networkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const canvasPosition = networkInstance.current.DOMtoCanvas({ x, y });

    const defaultData = {
      id: Math.random() * 1e7,
      x: canvasPosition.x,
      y: canvasPosition.y,
      label: draggedShape || 'New Node',
    };
    const data = await getNodeByName(defaultData.label);
    nodeManager.createNode(defaultData.id, {
      name: data.name,
      feature: data.feature,
      library: data.library,
      framework: data.framework,
      codeId: data.codeId,
      inport: data.inport,
      outport: data.outport,
      parameters: data.parameters,
      code: data.code,
    });
    nodes.current.add(defaultData);

    //set Node param valeues
    //setNodeParamValues(defaultData.id, defaultData.label);
  };

  // 🛠️ Start dragging the divider
  const handleMouseDown = (e) => {
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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

  const handleVerticalDividerMouseDown = (e) => {
    const startY = e.clientY;
    const startHeight = layerSelectionHeight;

    const minHeight = 150; // Minimum height for layer selection
    const maxHeight = window.innerHeight - 350; // Maximum height, leaving space for parameter viewer

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(
        100,
        Math.min(startHeight + deltaY, window.innerHeight - 200),
      );
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setLayerSelectionHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 🛠️ End dragging the divider
  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleOpenNewWindow = async () => {
    const windowId = await openNewWindow({
      width: 800,
      height: 600,
      title: 'New Project',
    });

    if (windowId) {
      console.log(editorMessages.NEW_WINDOW_OPENED(windowId));
    }
  };

  const executePythonScript = async () => {
    if (isRunning) {
      setOutput(
        (prev) =>
          prev + separators.NEW_LINE + editorErrors.PROCESS_ALREADY_RUNNING,
      );
      return;
    }
    graphManager.setNodes(nodes);
    graphManager.setEdges(edges);
    setIsRunning(true);
    //handleOpenNewWindow();
    window.backend.trainModel(graphManager.getGraphDataAsJson());

    try {
      await window.dialog.onDialogUpdate((message) => {
        const htmlOutput = convert.toHtml(message);
        setOutput((prevOutput) => prevOutput + htmlOutput);
      });
      setOutput(
        (prevOutput) =>
          prevOutput +
          separators.LINE_SEP +
          editorMessages.MODEL_EXECUTION_INITIATED +
          separators.LINE_SEP,
      );
      await window.api.runPython(TEST_PY_FILE);
    } catch (error) {
      setOutput((prevOutput) => prevOutput + `\n${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Update handleRun
  const handleRun = () => {
    setOutput('');
    //check for graph.
    const currentEdges = edges.current.get();
    const graphAnalyzer = new GraphAnalyzer();
    const result = graphAnalyzer.validateGraph(currentEdges);
    const hyperParam = graphManager.getHyperparameters();
    if (!hyperParam) {
      setOutput(
        (prev) => prev + editorErrors.SET_HYPERPARAMETERS + separators.NEW_LINE,
      );
      return;
    }
    setOutput(
      (prevOutput) =>
        prevOutput +
        separators.LINE_SEP +
        editorMessages.MODEL_COMPILATION_INITIATED +
        separators.LINE_SEP,
    );
    if (result.isValid) {
      setOutput((prevOutput) => prevOutput + editorMessages.ALL_CHECKS_PASSED);
      executePythonScript();
    } else {
      setOutput((prevOutput) => prevOutput + result.errors.join('\n--> '));
    }
  };

  const handleStop = async () => {
    if (isRunning) {
      await window.api.stopPython();
      setIsRunning(false);
      setOutput(
        (prev) => prev + separators.NEW_LINE + editorErrors.USER_STOPPED,
      );
    }
  };

  const onSave = async () => {
    if (!isRunning) {
      setLoadingMessage(loaderMessages.SAVING);
      graphManager.setNodes(nodes);
      graphManager.setEdges(edges);

      if (pathToSaveRef.current === null) {
        pathToSaveRef.current = await window.dialog.saveFilePathPicker({
          defaultName: 'model.mff',
          extensions: ['mff'],
        });

        if (pathToSaveRef.current === null) {
          setLoadingMessage(loaderMessages.EMPTY);
          setOutput(
            (prev) => prev + separators.NEW_LINE + editorErrors.SAVE_CANCELLED,
          );
          return;
        }
      }

      try {
        await window.backend.saveModel(
          graphManager.getGraphDataAsJson(),
          pathToSaveRef.current,
        );
        setLoadingMessage(loaderMessages.EMPTY);
        setOutput(
          (prev) =>
            prev +
            separators.NEW_LINE +
            editorMessages.MODEL_SAVED_SUCCESS(pathToSaveRef.current),
        );
      } catch (error) {
        console.error(editorErrors.ERROR_SAVING_MODEL(error));
        setOutput(
          (prev) =>
            prev +
            separators.NEW_LINE +
            editorErrors.ERROR_SAVING_MODEL(error.message),
        );
      }
    } else {
      setOutput(
        (prev) =>
          prev + separators.NEW_LINE + editorErrors.STOP_TRAINING_BEFORE_SAVE,
      );
    }
  };

  const onOpen = async () => {
    setLoadingMessage(loaderMessages.OPENING);
    const pathToload = await window.dialog.filePicker({
      name: 'Load_File',
      extensions: ['mff'],
    });
    setLoadingMessage(loaderMessages.EMPTY);
    try {
      setLoadingMessage(loaderMessages.LOADING);
      const result = await window.backend.loadModel(pathToload);
      if (result && result.nodes && result.edges) {
        // Clear existing nodes and edges
        nodes.current.clear();
        edges.current.clear();
        graphManager.clearAllNodesAndEdges();

        // Add the loaded nodes to the network
        nodes.current.add(result.nodes);

        // Add the loaded edges to the network
        edges.current.add(result.edges);

        // Restore the model nodes in the ModelNodeManager
        const nodeManager = ModelNodeManager.getInstance();
        result.nodes.forEach((node) => {
          nodeManager.createNode(node.id, {
            name: node.name,
            feature: node.feature,
            library: node.library,
            framework: node.framework,
            codeId: node.codeId,
            inport: node.inport,
            outport: node.outport,
            parameters: node.parameters,
            code: node.code,
          });
        });

        // Set hyperparameters if they exist
        if (result.hyperparameters) {
          graphManager.setHyperparameters(result.hyperparameters);
        }

        // Fit the network to show all nodes
        if (networkInstance.current) {
          networkInstance.current.fit();
        }

        pathToSaveRef.current = pathToload;

        setOutput(
          (prev) =>
            prev + separators.NEW_LINE + editorMessages.MODEL_LOADED_SUCCESS,
        );
      } else {
        setOutput(
          (prev) =>
            prev + separators.NEW_LINE + editorErrors.LOAD_FAILED_INVALID_MODEL,
        );
      }
      setLoadingMessage(loaderMessages.EMPTY);
    } catch (error) {
      console.error(editorErrors.ERROR_LOADING_MODEL(error));
      setOutput(
        (prev) =>
          prev +
          separators.NEW_LINE +
          editorErrors.ERROR_LOADING_MODEL(error.message),
      );
    }
  };

  return (
    <div className="container" ref={containerRef}>
      <LoadingOverlay isVisible={!!loadingMessage} message={loadingMessage} />
      <Toolbar
        onRun={handleRun}
        onStop={handleStop}
        isRunning={isRunning}
        showInputConfig={isInputNode}
        onInputConfig={() => setIsInputModalOpen(true)}
        onHyperParam={() => setIsHyperParamModalOpen(true)}
        onSave={onSave}
        onOpen={onOpen}
      />
      <ModelInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        selectedNode={selectedNode}
      />
      <HyperparameterModal
        isOpen={isHyperParamModalOpen}
        onClose={() => setIsHyperParamModalOpen(false)}
      />
      <div className="main-content">
        {/* Left Panel */}
        <div
          className="left-panel"
          ref={leftPanelRef}
          style={{
            width: `${leftPanelWidth}px`,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div
            style={{
              height: `${layerSelectionHeight}px`,
              overflow: 'auto',
              minHeight: '100px',
              maxHeight: `calc(100% - 150px)`,
              display: 'flex', // Add flex display
              flexDirection: 'column', // Stack children vertically
            }}
          >
            <LayerSelectionPanel onDragStart={handleDragStart} />
          </div>

          <div
            className="horizontal-divider"
            onMouseDown={handleVerticalDividerMouseDown}
            style={{ cursor: 'row-resize' }}
          />

          <div
            style={{
              flex: 1,
              minHeight: '150px', // Minimum height for parameter viewer
              overflow: 'auto',
            }}
          >
            <ParameterViewer selectedNode={selectedNode} height="100%" />
          </div>
          <FooterLine isRunning={isRunning} framework={activeFramework} />
        </div>

        {/* Divider for resizing columns */}
        <div
          className="divider"
          ref={dividerRef}
          onMouseDown={handleMouseDown}
        ></div>

        {/* Right side container */}
        <div
          className="right-side"
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {/* Right Panel */}
          <div className="right-panel" ref={rightPanelRef}>
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
