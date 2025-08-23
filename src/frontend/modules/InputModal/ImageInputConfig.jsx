import React, { useEffect, useState } from 'react';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager';

export function ImageInputConfig({ onSaveReady, selectedNode, properties }) {
  // Ftech node parameters from ModelNodeManager
  const nodeManager = ModelNodeManager.getInstance();
  const nodePrams = nodeManager.getNode(selectedNode?.id);
  const [inputParams, setInputParams] = useState({
    Folder: properties?.Folder || '',
    'Number of Classes': properties?.['Number of Classes'] || '',
    'Total Images': properties?.['Total Images'] || '',
  });
  const [detectedClasses, setDetectedClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState(new Set());
  const [classStats, setClassStats] = useState({});

  const restoreFolderConfiguration = async () => {
    const nodePrams = nodeManager.getNode(selectedNode?.id);
    const folderPath = nodePrams?.parameters?.find(
      (p) => p.name === 'Folder',
    )?.value;
    if (folderPath && folderPath.trim() !== '') {
      try {
        const analysisResult = await window.backend.analyseFolder(folderPath);
        if (analysisResult) {
          const { folders, totalImages } = analysisResult;

          const classes = folders.map((folder) => folder.folderName);
          const statistics = {};
          folders.forEach((folder) => {
            statistics[folder.folderName] = folder.imageCount;
          });

          setDetectedClasses(classes);
          setClassStats(statistics);

          // Restore selected classes if available
          const savedClasses = properties?.['Selected Classes'];
          if (savedClasses && Array.isArray(savedClasses)) {
            const classIndices = new Set();
            savedClasses.forEach((className) => {
              const index = classes.indexOf(className);
              if (index !== -1) {
                classIndices.add(index);
              }
            });
            setSelectedClasses(classIndices);
          }
        }
      } catch (error) {
        console.error('Error restoring image folder configuration:', error);
      }
    }
  };

  // Restore folder configuration if folder is already selected
  useEffect(() => {
    restoreFolderConfiguration();
  }, []);

  // Initialize selections when classes are detected (only if no saved configuration)
  useEffect(() => {
    if (detectedClasses.length > 0) {
      // Only set defaults if no saved configuration exists
      const savedClasses = properties?.['Selected Classes'];

      if (!savedClasses || savedClasses.length === 0) {
        // Default: select all detected classes
        const defaultClasses = new Set(
          detectedClasses.map((_, index) => index),
        );
        setSelectedClasses(defaultClasses);
      }
    }
  }, [detectedClasses, selectedNode]);

  const handleSave = async () => {
    const selectedClassNames = Array.from(selectedClasses).map(
      (index) => detectedClasses[index],
    );

    if (selectedClassNames.length === 0) {
      console.error('No classes selected');
      return;
    }

    const totalSelectedImages = selectedClassNames.reduce(
      (total, className) => total + (classStats[className] || 0),
      0,
    );

    const updatedNode = [
      {
        name: 'Folder',
        value: inputParams.Folder,
      },
      {
        name: 'Number of Classes',
        value: selectedClassNames.length,
      },
      {
        name: 'Total Images',
        value: totalSelectedImages,
      },
      {
        name: 'Selected Classes',
        value: selectedClassNames,
      },
      {
        name: 'Class Statistics',
        value: classStats,
      },
    ];

    await restoreFolderConfiguration();
    nodeManager.updateMultipleNodeParameters(selectedNode.id, updatedNode);
  };

  // Register the save handler with parent
  useEffect(() => {
    if (onSaveReady) {
      onSaveReady('imageInput', handleSave);
    }
  }, [onSaveReady, selectedClasses, inputParams, detectedClasses, classStats]);

  const handleFolderSelect = async () => {
    const folderPath = await window.dialog.filePicker([], true);

    if (folderPath) {
      try {
        // Call backend to analyze image folder structure
        const analysisResult = await window.backend.analyseFolder(folderPath);
        if (analysisResult) {
          const { folders, totalImages } = analysisResult;

          // Extract class names and statistics from the folders array
          const classes = folders.map((folder) => folder.folderName);
          const statistics = {};
          folders.forEach((folder) => {
            statistics[folder.folderName] = folder.imageCount;
          });

          setDetectedClasses(classes);
          setClassStats(statistics);
          setInputParams((prev) => ({
            ...prev,
            Folder: folderPath,
            'Number of Classes': classes.length,
            'Total Images': totalImages,
          }));
        } else {
          console.error('Failed to analyze folder:', analysisResult.error);
          // Reset states on error
          setDetectedClasses([]);
          setClassStats({});
          setInputParams((prev) => ({
            ...prev,
            Folder: '',
            'Number of Classes': 0,
            'Total Images': 0,
          }));
        }
      } catch (error) {
        console.error('Error analyzing image folder:', error);
        // Reset states on error
        setDetectedClasses([]);
        setClassStats({});
        setInputParams((prev) => ({
          ...prev,
          Folder: '',
          'Number of Classes': 0,
          'Total Images': 0,
        }));
      }
    }
  };

  const handleClassChange = (index, checked) => {
    const newSelected = new Set(selectedClasses);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedClasses(newSelected);
  };

  const getSelectedImagesCount = () => {
    return Array.from(selectedClasses).reduce(
      (total, index) => total + (classStats[detectedClasses[index]] || 0),
      0,
    );
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <div className="parameter-item">
          <label style={{ fontWeight: 'bold' }}>Image Folder:</label>
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
            <input
              type="text"
              value={inputParams.Folder}
              readOnly
              placeholder="Select image folder..."
              style={{ flex: 1, padding: '5px' }}
            />
            <button
              onClick={handleFolderSelect}
              style={{ padding: '5px 10px' }}
            >
              Browse
            </button>
          </div>
        </div>

        {detectedClasses.length > 0 && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            <div>Total classes detected: {detectedClasses.length}</div>
            {/* <div>Total images: {inputParams['Total Images']}</div> */}
            <div>Selected images: {getSelectedImagesCount()}</div>
          </div>
        )}

        {detectedClasses.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Class Selection
            </div>
            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                padding: '10px',
              }}
            >
              {detectedClasses.map((className, index) => (
                <div
                  key={index}
                  style={{
                    margin: '8px 0',
                    padding: '8px',
                    backgroundColor: selectedClasses.has(index)
                      ? '#f0f8ff'
                      : '#fff',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="checkbox"
                      id={`class-${index}`}
                      checked={selectedClasses.has(index)}
                      onChange={(e) =>
                        handleClassChange(index, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`class-${index}`}
                      style={{ fontWeight: '500', cursor: 'pointer' }}
                    >
                      {className}
                    </label>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      backgroundColor: '#f5f5f5',
                      padding: '2px 6px',
                      borderRadius: '3px',
                    }}
                  >
                    {classStats[className] || 0} images
                  </div>
                </div>
              ))}
            </div>

            {detectedClasses.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  color: '#999',
                  padding: '20px',
                  fontStyle: 'italic',
                }}
              >
                No image classes detected. Please select a folder with organized
                image subdirectories.
              </div>
            )}
          </div>
        )}

        {inputParams.Folder && detectedClasses.length === 0 && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              color: '#856404',
            }}
          >
            <strong>Note:</strong> Expected folder structure:
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            >
              selected_folder/
              <br />
              ├── class1/
              <br />
              │ ├── image1.jpg
              <br />
              │ └── image2.png
              <br />
              ├── class2/
              <br />
              │ ├── image3.jpg
              <br />
              │ └── image4.png
              <br />
              └── ...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
