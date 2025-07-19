// export default function DesignApp() {
//   const {
//     nodes,
//     edges,
//     selectedNode,
//     setSelectedNode,
//     isInputNode,
//     graphManager,
//     nodeManager,
//   } = useGraphData();

//   const {
//     networkRef,
//     fitToScreen,
//     updatePositions,
//     registerSelectHandler,
//   } = useVisNetwork({ nodes, edges, setSelectedNode });

//   const drag = useDragAndDrop({ networkRef, nodeManager, nodes });

//   useEditorHotkeys({ fitToScreen, onSave });
//   const { onSave, onSaveAs, onOpen } = useModelPersistence({
//     nodes, edges, updatePositions, graphManager,
//   });

//   const { handleRun, handleStop, isRunning } = useModelExecutor({
//     nodes, edges, graphManager,
//   });

//   const { leftPanelWidth, layerSelectionHeight, handlers } = useResizablePanels();

//   return (
//     <ResizableContainer>
//       <Toolbar
//         onRun={handleRun}
//         onStop={handleStop}
//         isRunning={isRunning}
//         showInputConfig={isInputNode}
//         onInputConfig={() => setIsInputModalOpen(true)}
//         onHyperParam={() => setIsHyperParamModalOpen(true)}
//         onSave={onSave}
//         onSaveAs={onSaveAs}
//         onOpen={onOpen}
//         />
//       <Modals ... />
//       <MainLayout
//         leftPanel={<LeftPanel ... />}
//         rightPanel={<RightPanel ... />}
//         divider={<PanelDivider onDrag={handlers.onHorizontalDrag} />}
//       />
//     </ResizableContainer>
//   );
// }
