import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from torch.utils.data import TensorDataset
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import os


# Load and preprocess data
file_path = 'train_new.csv'
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
feature_columns = ["x"]
target_column = 'y'

X = data[feature_columns]
y = data[target_column]

print("\nSelected Features:", feature_columns)
print("Target Variable:", target_column)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=80, 
    random_state=42
)

# Convert to PyTorch tensors
X_train_tensor = torch.FloatTensor(X_train.values)
y_train_tensor = torch.FloatTensor(y_train.values)
X_test_tensor = torch.FloatTensor(X_test.values)
y_test_tensor = torch.FloatTensor(y_test.values)

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
        self.layer1 = nn.Linear(1, 1, True)
        
    def forward(self, x):
        x = self.layer1(x)
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
        
        print("-" * 50)
model = MyModel()
model.print_model_info()

# Training loop
optimizer = optim.Adam(model.parameters(), lr=learning_rate)
criterion = nn.MSELoss()

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