export const importTemplate = `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from torch.utils.data import TensorDataset
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import os
`;

export const inputTemplate = `# Load and preprocess data
file_path = r'<%= file_name %>'
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
print(f"Data types:\\n{data.dtypes}")
print("\\nSample data:\\n", data.head())
print("\\nBasic statistics:\\n", data.describe())
print("-" * 50)

# Prepare features and labels
feature_columns = <%- JSON.stringify(features) %>
target_column = '<%= predictor %>'

X = data[feature_columns]
y = data[target_column]

print("\\nSelected Features:", feature_columns)
print("Target Variable:", target_column)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=<%= test_split %>, 
    random_state=42
)

# Convert to PyTorch tensors
X_train_tensor = torch.FloatTensor(X_train.values)
y_train_tensor = torch.FloatTensor(y_train.values)
X_test_tensor = torch.FloatTensor(X_test.values)
y_test_tensor = torch.FloatTensor(y_test.values)

# Create data loaders
batch_size = <%- batch_size %>
train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
test_dataset = TensorDataset(X_test_tensor, y_test_tensor)

train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=batch_size)

print("\\nData Loading Complete:")
print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")
print(f"Feature dimension: {X_train.shape[1]}")
print("-" * 50)
`;

export const imageInputTemplate = `# Load and preprocess image data
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from PIL import Image
import os

folder_path = r'<%= folder_path %>'
num_classes = <%= num_classes %>
total_images = <%= total_images %>
selected_classes = <%- JSON.stringify(selected_classes) %>
train_split = <%= train_split %>
test_split = <%= test_split %>

# Print dataset metadata
print("Image Dataset Info:")
print("-" * 50)
print(f"Dataset folder: {folder_path}")
print(f"Number of classes: {num_classes}")
print(f"Total images: {total_images}")
print(f"Selected classes: {selected_classes}")
print(f"Train split: {train_split}")
print(f"Test split: {test_split}")

# Define image transformations
transform_train = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

transform_test = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Custom dataset class to filter selected classes
class FilteredImageFolder(ImageFolder):
    def __init__(self, root, transform=None, selected_classes=None):
        super().__init__(root, transform)
        if selected_classes:
            # Filter samples to include only selected classes
            self.selected_class_indices = [self.class_to_idx[cls] for cls in selected_classes if cls in self.class_to_idx]
            self.samples = [(path, target) for path, target in self.samples if target in self.selected_class_indices]
            self.targets = [target for target in self.targets if target in self.selected_class_indices]
            
            # Update class mappings
            self.classes = selected_classes
            self.class_to_idx = {cls: idx for idx, cls in enumerate(selected_classes)}
            
            # Remap target indices to be sequential (0, 1, 2, ...)
            old_to_new_idx = {old_idx: new_idx for new_idx, old_idx in enumerate(self.selected_class_indices)}
            self.samples = [(path, old_to_new_idx[target]) for path, target in self.samples]
            self.targets = [old_to_new_idx[target] for target in self.targets]

# Load the full dataset with selected classes only
full_dataset = FilteredImageFolder(
    root=folder_path, 
    transform=transform_train,
    selected_classes=selected_classes if selected_classes else None
)

# Print class information
print("\\nClass Information:")
print("-" * 50)
print(f"Classes found: {full_dataset.classes}")
print(f"Class to index mapping: {full_dataset.class_to_idx}")
print(f"Number of samples per class:")

# Count samples per class
class_counts = {}
for _, target in full_dataset.samples:
    class_name = full_dataset.classes[target]
    class_counts[class_name] = class_counts.get(class_name, 0) + 1

for class_name, count in class_counts.items():
    print(f"  {class_name}: {count} samples")

# Calculate dataset split sizes
dataset_size = len(full_dataset)
train_size = int(train_split * dataset_size)
test_size = dataset_size - train_size

print(f"\\nDataset Split:")
print("-" * 50)
print(f"Total dataset size: {dataset_size}")
print(f"Training size: {train_size}")
print(f"Testing size: {test_size}")

# Split the dataset
train_dataset, test_dataset = torch.utils.data.random_split(
    full_dataset, 
    [train_size, test_size],
    generator=torch.Generator().manual_seed(42)
)

# Create test dataset with different transforms
test_dataset_with_transform = FilteredImageFolder(
    root=folder_path, 
    transform=transform_test,
    selected_classes=selected_classes if selected_classes else None
)

# Apply the same split to test dataset
_, test_dataset = torch.utils.data.random_split(
    test_dataset_with_transform, 
    [train_size, test_size],
    generator=torch.Generator().manual_seed(42)
)

# Create data loaders with num_workers=0 to avoid multiprocessing issues
batch_size = <%- batch_size %>
train_loader = DataLoader(
    train_dataset, 
    batch_size=batch_size, 
    shuffle=True,
    num_workers=0,  # Set to 0 to avoid multiprocessing issues
    pin_memory=False
)

test_loader = DataLoader(
    test_dataset, 
    batch_size=batch_size, 
    shuffle=False,
    num_workers=0,  # Set to 0 to avoid multiprocessing issues
    pin_memory=False
)

print("\\nData Loading Complete:")
print("-" * 50)
print(f"Training batches: {len(train_loader)}")
print(f"Testing batches: {len(test_loader)}")
print(f"Batch size: {batch_size}")

# Get image shape safely
try:
    sample_batch = next(iter(train_loader))
    print(f"Image shape: {sample_batch[0].shape}")
    print(f"Label shape: {sample_batch[1].shape}")
except Exception as e:
    print(f"Could not get sample batch: {e}")

print("-" * 50)
`;

export const hyperparameterTemplate = `# Initialize hyperparameters
num_epochs = <%= epochs || 10 %>
learning_rate = <%= learning_rate || 0.001 %>

# Print hyperparameter configuration
print("\\nHyperparameters:")
print("-" * 50)
print(f"Number of epochs: {num_epochs}")
print(f"Learning rate: {learning_rate}")
print("-" * 50)`;

export const modelTemplate = `class <%= model_name %>(nn.Module):
    def __init__(self):
        super(<%= model_name %>, self).__init__()
        <% layers.forEach((layer, index) => { %>self.layer<%= index + 1 %> = nn.<%= layer.type %>(<% if (layer.params) { %><%- layer.params.map(param => param.value).join(', ') %><% } %>)
        <% }) %>
    def forward(self, x):
        <% layers.forEach((layer, index) => { %>x = self.layer<%= index + 1 %>(x)
        <% }) %>return x
    def print_model_info(self):
        """Print model architecture and parameter information"""
        print("\\nModel Architecture:")
        print("-" * 50)
        print(self)
        
        # Calculate total parameters
        total_params = sum(p.numel() for p in self.parameters())
        trainable_params = sum(p.numel() for p in self.parameters() if p.requires_grad)
        
        print("\\nModel Parameters:")
        print("-" * 50)
        print(f"Total parameters: {total_params:,}")
        print(f"Trainable parameters: {trainable_params:,}")
        print(f"Non-trainable parameters: {total_params - trainable_params:,}")
        
        # Print layer-wise parameters
        print("\\nLayer-wise Parameters:")
        print("-" * 50)
        <% layers.forEach((layer, index) => { %>print(f"Layer {<%= index + 1 %>} ({self.layer<%= index + 1 %>.__class__.__name__}): {sum(p.numel() for p in self.layer<%= index + 1 %>.parameters()):,} parameters")
        <% }) %>
        print("-" * 50)
model = <%= model_name %>()
model.print_model_info()`;

export const trainingLoopTemplate = `# Training loop
optimizer = optim.<%= optimizer %>(model.parameters(), lr=learning_rate)
criterion = nn.<%= loss_function %>()

# Training metrics tracking
train_losses = []
test_losses = []
test_metrics = []  # For regression: RMSE or MAE; For classification: accuracy

print("\\nStarting Training:")
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
print("Training complete!")`;
