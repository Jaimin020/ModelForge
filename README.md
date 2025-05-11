# **ModelForge**

_Drag-and-Drop AI Model Builder with Code Generation_

## **Overview**

**ModelForge** is a no-code desktop application that empowers users to design, train, and export machine learning (ML) and deep learning (DL) models using a drag-and-drop interface. Build powerful models with ease and generate ready-to-use Python (and Rust) code.

## Whether you are a student, a professional, or a company leveraging large language models (LLMs), ModelForge simplifies the machine learning workflow, making it accessible for everyone.

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/11b83f22-5dad-47c5-8e19-ef4170d5c23b" />

---

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/3386b22b-e907-4298-8425-5f1e9937d5cd" />

---

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/4bb9b0e6-9cd3-4914-b4b4-21041d685d7c" />

---

## **Features**

- **Drag-and-Drop Model Creation**:  
   Design your ML/DL architecture visually by dragging components like layers and activation functions.

- **Real-Time Training Insights**:  
   Get live updates on training metrics, including loss and accuracy, with performance graphs displayed on the dashboard.

- **Code Generation**:  
   Export your models as Python scripts (TensorFlow, PyTorch) or Rust for advanced use cases.

- **Prebuilt Model Templates**:  
   Start with pre-designed architectures like CNNs, RNNs, and Transformers, or build custom ones from scratch.

- **Data Handling**:  
   Import datasets (CSV, Excel, images) and preprocess them with tools like normalization and augmentation.

- **Cross-Platform Support**:  
   Run the app seamlessly on Windows, macOS, and Linux.

- **Export Models**:  
   Save your models in formats like `.h5`, `.pt`, or ONNX for deployment.

---

## **Technology Stack**

- **Frontend**: Electron + React
- **Backend**: Node.js
- **ML Frameworks**: TensorFlow/Keras, PyTorch
- **Visualization**: `vis-network`
- **Packaging**: `electron-builder`

---

## **Installation**

### **Prerequisites**

1. Install [Node.js](https://nodejs.org/) (for Electron and React).
2. Install [Python 3.9+](https://www.python.org/) (for ML frameworks).
3. Install pip dependencies: TensorFlow, PyTorch, and related libraries.

---

### **Installation Steps**

1. Clone the repository:
   ```sh
   git clone https://github.com/Jaimin020/ModelForge.git
   ```
2. Navigate to the project directory:
   ```sh
   cd ModelForge
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Make a copy of the .env.example file as .env and set the BASE_PATH accordingly.
5. Execute the environment path setup script
   ```sh
   node setupEnvPath.js
   ```

---

### **Python Setup**

1. [Download Python Setup](https://drive.google.com/file/d/1N0fr40XlEUpoWexgTJqWIFK1bJxOTdnz/view?usp=sharing)
2. Extract the downloaded setup to src/main/installed-python within the ModelForge directory.

---

### **Running the Electron Application**

1. To launch the Electron app, use the following command:
   ```sh:
   npm start
   ```

---
