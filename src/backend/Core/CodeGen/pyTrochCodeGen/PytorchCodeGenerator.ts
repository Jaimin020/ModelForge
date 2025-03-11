import { modelTemplate } from './PyCode.js';
import { AbstractCodeGenerator } from '../AbstractCodeGenerator';
import * as ejs from 'ejs';

export class PyTorchCodeGenerator extends AbstractCodeGenerator {
  getImports(): string {
    return `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader`;
  }

  getInput(): string {
    return `# Data loading and preprocessing code will go here
# This will be implemented based on the input data format`;
  }

  getModel(): string {
    return ejs.render(modelTemplate, this.modelData);
  }

  getHyperparameters(): string {
    return `# Hyperparameters
learning_rate = ${this.hyperparameters.learning_rate || 0.001}
batch_size = ${this.hyperparameters.batch_size || 32}
epochs = ${this.hyperparameters.epochs || 10}`;
  }

  getTrainingLoop(): string {
    return `# Training loop
optimizer = optim.Adam(model.parameters(), lr=learning_rate)
criterion = nn.CrossEntropyLoss()

for epoch in range(epochs):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()`;
  }

  getSaveModel(): string {
    return `# Save the trained model
torch.save(model.state_dict(), 'model.pth')`;
  }
}
