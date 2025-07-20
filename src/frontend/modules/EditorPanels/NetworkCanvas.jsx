const NetworkCanvas = ({ networkRef, handleDrop }) => {
  return (
    <div className="network-canvas">
      <div
        id="mynetwork"
        ref={networkRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      ></div>
    </div>
  );
};

export default NetworkCanvas;
