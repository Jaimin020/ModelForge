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


# Load and preprocess image data
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from PIL import Image
import os

folder_path = r'/Users/jaiminchauhan/Downloads/Rice_Image_Dataset'
num_classes = 2
total_images = 30000
selected_classes = ["Arborio","Basmati"]
train_split = 80 * 0.01
test_split = 10 * 0.01

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
print("\nClass Information:")
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
if dataset_size == 0:
    raise ValueError(
        f"No images were found in '{folder_path}' for classes {selected_classes}. "
        "Check the dataset path and selected class names."
    )

if not 0 < train_split < 1:
    raise ValueError(f"train_split must be between 0 and 1, got {train_split}")
if not 0 <= test_split < 1:
    raise ValueError(f"test_split must be between 0 and 1, got {test_split}")
if train_split + test_split > 1:
    raise ValueError(
        f"train_split ({train_split}) and test_split ({test_split}) exceed 100% of the dataset"
    )

train_size = int(round(train_split * dataset_size))
if dataset_size > 1:
    train_size = min(max(train_size, 1), dataset_size - 1)
else:
    train_size = dataset_size
test_size = dataset_size - train_size

print(f"\nDataset Split:")
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
batch_size = 32
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

print("\nData Loading Complete:")
print("-" * 50)
print(f"Training batches: {len(train_loader)}")
print(f"Testing batches: {len(test_loader)}")
print(f"Batch size: {batch_size}")

if len(train_loader) == 0:
    raise ValueError("Training loader is empty after splitting the dataset.")

# Get image shape safely
try:
    sample_batch = next(iter(train_loader))
    print(f"Image shape: {sample_batch[0].shape}")
    print(f"Label shape: {sample_batch[1].shape}")
except Exception as e:
    print(f"Could not get sample batch: {e}")

print("-" * 50)


# Initialize hyperparameters
num_epochs = 2
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
        self.layer1 = nn.Conv2d(3, 3, 3, 1, 1)
        self.layer2 = nn.ReLU()
        self.layer3 = nn.Flatten(1, -1)
        self.layer4 = nn.Linear(150528, 2, True)
        
    def forward(self, x):
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
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
    avg_test_loss = float("nan")
    
    with torch.no_grad():
        all_predictions = []
        all_targets = []
        for data, target in test_loader:
            output = model(data)
            test_loss += criterion(output, target).item()
            all_predictions.append(output)
            all_targets.append(target)
    
    if len(test_loader) == 0:
        test_losses.append(avg_test_loss)
        print(f"Epoch {epoch+1}/{num_epochs}, "
              f"Train Loss: {avg_train_loss:.4f}, "
              "Test Loss: N/A (empty test split)")
        continue

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
