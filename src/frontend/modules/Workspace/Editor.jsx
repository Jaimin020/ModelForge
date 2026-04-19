import React, { useEffect, useRef, useState } from 'react';
import {
  Network,
  DataSet,
} from 'vis-network/standalone/umd/vis-network.min.js';
import Convert from 'ansi-to-html';
import { Toolbar } from '../../components/Toolbar.jsx';
import LeftPanel from '../EditorPanels/LeftPanel.jsx';
import RightPanel from '../EditorPanels/RightPanel.jsx';
import Divider from '../EditorPanels/Divider.jsx';
import { getNodeByName } from '../../utils/nodeOps/getNodeByName.jsx';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager.ts';
import { HyperparameterModal } from '../../components/HyperparameterModal';
import { SettingsModal } from '../../components/SettingsModal';
import { GraphDataManager } from '../../utils/graphUtils/GraphDataManager.ts';
import { LoadingOverlay } from '../Loading/LoadingModal.jsx';
import { FooterLine } from '../Footer/FooterLine.jsx';
import { openNewWindow } from '../../utils/windowUtils/windowUtils';
import { TEST_PY_FILE } from '../../../envPath.js';
import { ModelInputModal } from '../InputModal/ModelInputModal.jsx';
import './style.css';
// For error and message strings
import * as editorStrings from '../../utils/strings/editorStrings.js';
import { separators } from '../../utils/strings/constants.js';
import { loaderMessages } from '../../utils/strings/loaderStrings.js';

import { CopyPasteCommand } from '../../utils/clipboard/CopyPasteCommand.ts';
import { HistoryManager } from '../../utils/history/HistoryManager.ts';
import { GraphMemento } from '../../utils/history/GraphMemento.ts';

import { appendDiagnostic } from '../../utils/DiagnosticViewer/diagnosticUtil.ts';
// For saving models
import * as ModelPersistanceHandler from '../../utils/Editor/ModelPersistanceHandler.js';
import * as ModelExecutionHandler from '../../utils/Editor/ModelExecutionHandler.js';

const DesignApp = () => {
  const networkRef = useRef();
  const draggedShapeRef = useRef(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);

  const nodes = useRef(new DataSet([]));
  const edges = useRef(new DataSet([]));
  const networkInstance = useRef(null);
  const resizeObserver = useRef(null);

  // TODO: output should be in DiagnosticViewer (yjain)
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Add state for selected node
  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeRef = useRef(null);

  // Marquee Drag Selection State
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const isSelectingRef = useRef(false);
  const selectionBoxRef = useRef({ startX: 0, startY: 0, endX: 0, endY: 0 });

  const copyPasteCommand = useRef(new CopyPasteCommand());
  const mousePosRef = useRef({ x: 0, y: 0 });
  const historyManagerRef = useRef(new HistoryManager());

  const nodeManager = ModelNodeManager.getInstance();
  const graphManager = GraphDataManager.getInstance();

  const [isInputNode, setIsInputNode] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isHyperParamModalOpen, setIsHyperParamModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Add at the top of component
  const convert = new Convert({ newline: true });

  // Loaing overlay message
  const [loadingMessage, setLoadingMessage] = useState('');

  // FrameWork Info
  const [activeFramework, setActiveFramework] = useState('PyTorch');

  // History / Undo / Redo capabilities
  const getSnapshot = () => {
    return new GraphMemento(
      nodes.current.get(),
      edges.current.get(),
      nodeManager.getAllNodes()
    );
  };

  const captureState = () => {
    historyManagerRef.current.saveState(getSnapshot());
  };

  const restoreState = (snapshot) => {
    if (!snapshot) return;

    nodes.current.clear();
    edges.current.clear();
    nodeManager.clearAllNodes();

    snapshot.modelNodes.forEach(n => {
      const { id, ...data } = n;
      nodeManager.createNode(id, data);
    });

    nodes.current.add(snapshot.visNodes);
    edges.current.add(snapshot.visEdges);
  };

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
        multiselect: true,
      },
      manipulation: {
        addEdge: (data, callback) => {
          captureState();
          callback(data);
        },
        enabled: true,
        initiallyActive: true,
        addNode: false,
        // addEdge: true,
        editEdge: true,
        deleteNode: (data, callback) => {
          captureState();
          setSelectedNode(null);
          setIsInputModalOpen(null);
          nodeManager.deleteNode(data.nodes[0]);
          callback(data);
        },
        deleteEdge: (data, callback) => {
          captureState();
          callback(data);
        },
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
        selectedNodeRef.current = node;
        // Check if selected node is input type
        const modelNode = nodeManager.getNode(nodeId);
        setIsInputNode(modelNode?.feature?.toLowerCase().includes('input'));
      } else {
        setSelectedNode(null);
        selectedNodeRef.current = null;
        setIsInputNode(false);
      }
    });

    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        if (networkInstance.current) {
          const selection = networkInstance.current.getSelection();
          const positions = networkInstance.current.getPositions(selection.nodes);
          copyPasteCommand.current.copy(
            selection.nodes,
            selection.edges,
            nodes.current,
            edges.current,
            positions
          );
        }
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'v' || e.key === 'p')) {
        if (copyPasteCommand.current.hasMemento() && networkRef.current && networkInstance.current) {
          e.preventDefault();
          captureState();
          const rect = networkRef.current.getBoundingClientRect();
          const x = mousePosRef.current.x - rect.left;
          const y = mousePosRef.current.y - rect.top;
          const canvasPosition = networkInstance.current.DOMtoCanvas({ x, y });
          
          copyPasteCommand.current.paste(nodes.current, edges.current, canvasPosition.x, canvasPosition.y);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          const nextState = historyManagerRef.current.redo(getSnapshot());
          restoreState(nextState);
        } else {
          const prevState = historyManagerRef.current.undo(getSnapshot());
          restoreState(prevState);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        const nextState = historyManagerRef.current.redo(getSnapshot());
        restoreState(nextState);
      }
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
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);

    // Capture drag state to undo drags or run selection box logic
    networkInstance.current.on('dragStart', (params) => {
      if (params.event.srcEvent.shiftKey) {
        networkInstance.current.setOptions({ interaction: { dragView: false } });
        isSelectingRef.current = true;
        setIsSelecting(true);
        const startState = {
          startX: params.event.srcEvent.clientX,
          startY: params.event.srcEvent.clientY,
          endX: params.event.srcEvent.clientX,
          endY: params.event.srcEvent.clientY
        };
        selectionBoxRef.current = startState;
        setSelectionBox(startState);
      } else {
        captureState();
      }
    });

    networkInstance.current.on('dragging', (params) => {
      if (isSelectingRef.current) {
        const newEnd = {
          endX: params.event.srcEvent.clientX,
          endY: params.event.srcEvent.clientY
        };
        selectionBoxRef.current = { ...selectionBoxRef.current, ...newEnd };
        setSelectionBox(selectionBoxRef.current);
      }
    });

    networkInstance.current.on('dragEnd', (params) => {
      if (isSelectingRef.current) {
        isSelectingRef.current = false;
        setIsSelecting(false);
        networkInstance.current.setOptions({ interaction: { dragView: true } });

        const rect = networkRef.current.getBoundingClientRect();
        const box = selectionBoxRef.current;
        
        const domStartX = Math.min(box.startX, box.endX) - rect.left;
        const domStartY = Math.min(box.startY, box.endY) - rect.top;
        const domEndX = Math.max(box.startX, box.endX) - rect.left;
        const domEndY = Math.max(box.startY, box.endY) - rect.top;

        const canvasStart = networkInstance.current.DOMtoCanvas({ x: domStartX, y: domStartY });
        const canvasEnd = networkInstance.current.DOMtoCanvas({ x: domEndX, y: domEndY });

        const selectedIds = [];
        const allNodes = nodes.current.get();
        const positions = networkInstance.current.getPositions();

        allNodes.forEach(node => {
          const pos = positions[node.id];
          if (pos && 
              pos.x >= canvasStart.x && pos.x <= canvasEnd.x &&
              pos.y >= canvasStart.y && pos.y <= canvasEnd.y) {
             selectedIds.push(node.id);
          }
        });
        
        networkInstance.current.selectNodes(selectedIds);
      }
    });

    resizeObserver.current.observe(container);

    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
      if (networkInstance.current) networkInstance.current.destroy();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 🛠️ Handle drop event on the vis-network container
  const handleDrop = async (e) => {
    e.preventDefault();
    captureState();
    const rect = networkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const canvasPosition = networkInstance.current.DOMtoCanvas({ x, y });

    const defaultData = {
      id: Math.random() * 1e7,
      x: canvasPosition.x,
      y: canvasPosition.y,
      label: draggedShapeRef.current || 'New Node',
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

    // set Node param valeues
    // setNodeParamValues(defaultData.id, defaultData.label);
  };

  const handleOpenNewWindow = async () => {
    const windowId = await openNewWindow({
      width: 800,
      height: 600,
      title: 'New Project',
    });

    if (windowId) {
      console.log(editorStrings.messages.NEW_WINDOW_OPENED(windowId));
    }
  };

  const appendToOutput = (message, type = 'none') => {
    setOutput((prevOutput) => appendDiagnostic(prevOutput, message, type));
  };

  const executePythonScript = async () => {
    if (isRunning) {
      appendToOutput(editorStrings.warns.PROCESS_ALREADY_RUNNING, 'error');
      return;
    }
    graphManager.setNodes(nodes);
    graphManager.setEdges(edges);
    setIsRunning(true);
    // handleOpenNewWindow();
    window.backend.trainModel(graphManager.getGraphDataAsJson());

    try {
      await window.dialog.onDialogUpdate((message) => {
        const htmlOutput = convert.toHtml(message);
        appendToOutput(htmlOutput, 'none');
      });
      appendToOutput(editorStrings.messages.MODEL_EXECUTION_INITIATED, 'info');
      await window.api.runPython(TEST_PY_FILE);
    } catch (error) {
      appendToOutput(error, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRun = () => {
    ModelExecutionHandler.handleRun({
      edges,
      graphManager,
      appendToOutput,
      executePythonScript,
    });
  };

  const handleStop = async () => {
    ModelExecutionHandler.handleStop({
      isRunning,
      setIsRunning,
      appendToOutput,
    });
  };

  // Add this function inside the DesignApp component
  const updateNodePositions = () => {
    if (!networkInstance.current) return;

    // Get all node IDs
    const nodeIds = nodes.current.getIds();

    // Get positions for all nodes from the network
    const positions = networkInstance.current.getPositions(nodeIds);

    // Update each node with its current position
    nodeIds.forEach((id) => {
      if (positions[id]) {
        nodes.current.update({
          id,
          x: positions[id].x,
          y: positions[id].y,
        });
      }
    });
  };

  // TODO: Check if these can be moved to Toolbar completely
  const onSave = async () => {
    await ModelPersistanceHandler.saveModel({
      isRunning,
      nodes,
      edges,
      graphManager,
      setLoadingMessage,
      appendToOutput,
      updateNodePositions,
    });
  };

  const onSaveAs = async () => {
    await ModelPersistanceHandler.saveModelAs({
      isRunning,
      nodes,
      edges,
      graphManager,
      setLoadingMessage,
      appendToOutput,
      updateNodePositions,
    });
  };

  const onClear = async () => {
    if (isRunning) {
      appendToOutput(editorErrors.STOP_TRAINING_BEFORE_CLEAR, 'error');
      return;
    }
    nodes.current.clear();
    edges.current.clear();
    graphManager.clearAllNodesAndEdges();
    setSelectedNode(null);
    setOutput([]);
    setLoadingMessage(loaderMessages.EMPTY);
  };

  const onOpen = async () => {
    await ModelPersistanceHandler.onOpen({
      nodes,
      edges,
      graphManager,
      networkInstance,
      setLoadingMessage,
      appendToOutput,
      updateNodePositions,
    });
  };

  const onSettings = () => {
    setIsSettingsModalOpen(true);
  };

  return (
    <div className="container">
      <LoadingOverlay isVisible={!!loadingMessage} message={loadingMessage} />
      <Toolbar
        onRun={handleRun}
        onStop={handleStop}
        isRunning={isRunning}
        showInputConfig={isInputNode}
        onInputConfig={() => setIsInputModalOpen(true)}
        onHyperParam={() => setIsHyperParamModalOpen(true)}
        onSave={onSave}
        onSaveAs={onSaveAs}
        onOpen={onOpen}
        onClear={onClear}
        onSettings={onSettings}
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
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <div className="main-content">
        {isSelecting && (
          <div
            className="selection-box"
            style={{
              left: Math.min(selectionBox.startX, selectionBox.endX),
              top: Math.min(selectionBox.startY, selectionBox.endY),
              width: Math.abs(selectionBox.endX - selectionBox.startX),
              height: Math.abs(selectionBox.endY - selectionBox.startY)
            }}
          />
        )}
        <LeftPanel
          leftPanelWidth={leftPanelWidth}
          selectedNode={selectedNode}
          isRunning={isRunning}
          activeFramework={activeFramework}
          draggedShapeRef={draggedShapeRef}
        />
        <Divider setLeftPanelWidth={setLeftPanelWidth} />
        <RightPanel
          networkRef={networkRef}
          handleDrop={handleDrop}
          output={output}
          setOutput={setOutput}
        />
      </div>
    </div>
  );
};

export default DesignApp;
