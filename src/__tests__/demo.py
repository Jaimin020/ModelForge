import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from torch.utils.data import TensorDataset
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import os
import onnx
import zipfile
from io import BytesIO
import torch.onnx


# Load and preprocess data
file_path = r'/Users/jaiminchauhan/Downloads/titanic_processed_full_dataset.csv'
file_extension = os.path.splitext(file_path)[1].lower()

if file_extension == '.csv':
    data = pd.read_csv(file_path)
elif file_extension in ['.xlsx', '.xls']:
    data = pd.read_excel(file_path)
else:
    raise ValueError("Unsupported file format")

# Print dataset metadata
print("Dataset Info:")
print("-" * 50)
print(f"Total samples: {len(data)}")
print(f"Features: {data.columns.tolist()}")
print(f"Data types:\n{data.dtypes}")
print("\nSample data:\n", data.head())
print("\nBasic statistics:\n", data.describe())
print("-" * 50)

# Prepare features and labels
feature_columns = ["Pclass","Sex","Age","SibSp","Parch","Fare","Embarked_C","Embarked_Q","Embarked_S"]
target_column = 'Survived'

X = data[feature_columns]
y = data[target_column]

print("\nSelected Features:", feature_columns)
print("Target Variable:", target_column)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=10, 
    random_state=42
)

# Convert to PyTorch tensors
X_train_tensor = torch.FloatTensor(X_train.values)

# Determine y tensor type based on data type
if y_train.dtype == 'int64' or y_train.dtype == 'int32':
    y_train_tensor = torch.LongTensor(y_train.values)
    y_test_tensor = torch.LongTensor(y_test.values)
    print("Target variable is integer (classification task)")
else:
    y_train_tensor = torch.FloatTensor(y_train.values)
    y_test_tensor = torch.FloatTensor(y_test.values)
    print("Target variable is float (regression task)")

X_test_tensor = torch.FloatTensor(X_test.values)

# Convert test tensors to NumPy (ONNX Runtime expects NumPy)
X_test_np = X_test_tensor.cpu().numpy().astype(np.float32)
y_test_np = y_test_tensor.cpu().numpy().astype(np.float32)

# Save to JSON
import json
with open("/Users/jaiminchauhan/Projects/Git/ModelForge/src/__tests__/test_dataset.json", "w") as f:
    json.dump({
        "X_test": X_test_np.tolist(),
        "y_test": y_test_np.tolist()
    }, f)

# Create data loaders
batch_size = 1
train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
test_dataset = TensorDataset(X_test_tensor, y_test_tensor)

train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=batch_size)

print("\nData Loading Complete:")
print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")
print(f"Feature dimension: {X_train.shape[1]}")
print("-" * 50)


# Initialize hyperparameters
num_epochs = 100
learning_rate = 0.001

# Print hyperparameter configuration
print("\nHyperparameters:")
print("-" * 50)
print(f"Number of epochs: {num_epochs}")
print(f"Learning rate: {learning_rate}")
print("-" * 50)

class MyModel(nn.Module):
    def __init__(self):
        super(MyModel, self).__init__()
        self.layer1 = nn.Linear(9, 32, )
        self.layer2 = nn.ReLU()
        self.layer3 = nn.Linear(32, 16, )
        self.layer4 = nn.ReLU()
        self.layer5 = nn.Linear(16, 2, )
        
    def forward(self, x):
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.layer5(x)
        return x
    def print_model_info(self):
        """Print model architecture and parameter information"""
        print("\nModel Architecture:")
        print("-" * 50)
        print(self)
        
        # Calculate total parameters
        total_params = sum(p.numel() for p in self.parameters())
        trainable_params = sum(p.numel() for p in self.parameters() if p.requires_grad)
        
        print("\nModel Parameters:")
        print("-" * 50)
        print(f"Total parameters: {total_params:,}")
        print(f"Trainable parameters: {trainable_params:,}")
        print(f"Non-trainable parameters: {total_params - trainable_params:,}")
        
        # Print layer-wise parameters
        print("\nLayer-wise Parameters:")
        print("-" * 50)
        print(f"Layer {1} ({self.layer1.__class__.__name__}): {sum(p.numel() for p in self.layer1.parameters()):,} parameters")
        print(f"Layer {2} ({self.layer2.__class__.__name__}): {sum(p.numel() for p in self.layer2.parameters()):,} parameters")
        print(f"Layer {3} ({self.layer3.__class__.__name__}): {sum(p.numel() for p in self.layer3.parameters()):,} parameters")
        print(f"Layer {4} ({self.layer4.__class__.__name__}): {sum(p.numel() for p in self.layer4.parameters()):,} parameters")
        print(f"Layer {5} ({self.layer5.__class__.__name__}): {sum(p.numel() for p in self.layer5.parameters()):,} parameters")
        
        print("-" * 50)
model = MyModel()
model.print_model_info()

# Training loop
optimizer = optim.Adam(model.parameters(), lr=learning_rate)
criterion = nn.CrossEntropyLoss()

# Training metrics tracking
train_losses = []
test_losses = []
test_metrics = []  # For regression: RMSE or MAE; For classification: accuracy

print("\nStarting Training:")
print("-" * 50)

for epoch in range(num_epochs):
    # Training phase
    model.train()
    running_loss = 0.0
    
    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
        
    avg_train_loss = running_loss / len(train_loader)
    train_losses.append(avg_train_loss)
    
    # Evaluation phase
    model.eval()
    test_loss = 0
    
    with torch.no_grad():
        all_predictions = []
        all_targets = []
        for data, target in test_loader:
            output = model(data)
            test_loss += criterion(output, target).item()
            all_predictions.append(output)
            all_targets.append(target)
    
    avg_test_loss = test_loss / len(test_loader)
    test_losses.append(avg_test_loss)
    
    # Combine all batches for metric calculation
    all_predictions = torch.cat(all_predictions, dim=0)
    all_targets = torch.cat(all_targets, dim=0)
    
    # Calculate appropriate metrics based on loss function
    if isinstance(criterion, nn.MSELoss):
        # For regression: calculate RMSE
        rmse = torch.sqrt(torch.mean((all_predictions - all_targets) ** 2)).item()
        mae = torch.mean(torch.abs(all_predictions - all_targets)).item()
        test_metrics.append(rmse)
        metric_name = "RMSE"
        metric_value = rmse
        print(f"Epoch {epoch+1}/{num_epochs}, "
              f"Train Loss: {avg_train_loss:.4f}, "
              f"Test Loss: {avg_test_loss:.4f}, "
              f"RMSE: {rmse:.4f}, "
              f"MAE: {mae:.4f}")
    else:
        # For classification: calculate accuracy
        _, predicted = torch.max(all_predictions.data, 1)
        total = all_targets.size(0)
        correct = (predicted == all_targets).sum().item()
        accuracy = 100.0 * correct / total
        test_metrics.append(accuracy)
        metric_name = "Accuracy"
        metric_value = accuracy
        print(f"Epoch {epoch+1}/{num_epochs}, "
              f"Train Loss: {avg_train_loss:.4f}, "
              f"Test Loss: {avg_test_loss:.4f}, "
              f"Accuracy: {accuracy:.2f}%")

print("-" * 50)
print("Training complete!")

# Save ONNX model (weights are embedded in ONNX)
try:
    save_path = r'/Users/jaiminchauhan/Projects/Git/ModelForge/src/__tests__/modelAndweights.zip'
    base_path = os.path.dirname(save_path)
    base_name = os.path.splitext(os.path.basename(save_path))[0]
    
    # Create directory if it doesn't exist
    os.makedirs(base_path, exist_ok=True)
    
    # Export to ONNX format (weights are embedded)
    dummy_input = next(iter(train_loader))[0]  # Get a sample input
    onnx_file = f"{base_name}.onnx"
    onnx_path = os.path.join(base_path, onnx_file)
    
    # Export the model to ONNX
    torch.onnx.export(
        model,                     # model being run
        dummy_input,              # model input (or a tuple for multiple inputs)
        onnx_path,               # where to save the model
        export_params=True,      # store the trained parameter weights inside the model file
        opset_version=14,        # the ONNX version to export the model to
        do_constant_folding=True # whether to execute constant folding for optimization
    )
    
    # Verify the ONNX model
    try:
        onnx_model = onnx.load(onnx_path)
        onnx.checker.check_model(onnx_model)
        print("ONNX model verification successful")
    except Exception as onnx_error:
        print(f"Warning: ONNX model verification failed: {str(onnx_error)}")
        print("The model will still be saved but may need verification")
    
    # Check for external data file
    onnx_data_path = onnx_path + '.data'
    files_to_zip = [onnx_path]
    if os.path.exists(onnx_data_path):
        files_to_zip.append(onnx_data_path)
    
    # Create a zip file containing the ONNX model and data
    zip_path = f"{save_path}"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in files_to_zip:
            file_name = os.path.basename(file_path)
            zipf.write(file_path, file_name)
    
    # Clean up temporary files
    for file_path in files_to_zip:
        os.remove(file_path)
    
    print("\nONNX model saved successfully:")
    print("-" * 50)
    print(f"Save location: {zip_path}")
    print(f"Contents:")
    for file_path in files_to_zip:
        file_name = os.path.basename(file_path)
        print(f"  - {file_name}")
    print("-" * 50)
except ImportError as e:
    print("\nError: Required module not found:")
    print("-" * 50)
    print(f"Error: {str(e)}")
    print("Please install the required packages using:")
    print("pip install onnx")
    print("-" * 50)
except Exception as e:
    print("\nError saving ONNX model:")
    print("-" * 50)
    print(f"Error: {str(e)}")
    print("-" * 50)
