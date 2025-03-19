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
file_path = '<%= file_name %>'
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
y_train_tensor = torch.LongTensor(y_train.values)
X_test_tensor = torch.FloatTensor(X_test.values)
y_test_tensor = torch.LongTensor(y_test.values)

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


export const modelTemplate = `class <%= model_name %>(nn.Module):
    def __init__(self):
        super(<%= model_name %>, self).__init__()
        <% layers.forEach((layer, index) => { %>self.layer<%= index + 1 %> = nn.<%= layer.type %>(<% if (layer.params) { %><%- layer.params.map(param => param.value).join(', ') %><% } %>)
        <% }) %>
    def forward(self, x):
        <% layers.forEach((layer, index) => { %>x = self.layer<%= index + 1 %>(x)
        <% }) %>return x`;
