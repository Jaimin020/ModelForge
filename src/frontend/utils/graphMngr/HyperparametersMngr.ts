import { Hyperparameter } from '../../../interface/HyperparameterInterface';

export default class HyperparametersMngr {
  private static instance: HyperparametersMngr;
  private hyperparameters: Map<string, Hyperparameter>;

  private constructor() {
    this.hyperparameters = new Map<string, Hyperparameter>();
    this.initializeDefaultHyperparameters();
  }

  static getInstance(): HyperparametersMngr {
    if (!HyperparametersMngr.instance) {
      HyperparametersMngr.instance = new HyperparametersMngr();
    }
    return HyperparametersMngr.instance;
  }

  private initializeDefaultHyperparameters(): void {
    this.hyperparameters.set('learning_rate', {
      name: 'learning_rate',
      value: 0.001,
      type: 'number',
      min: 0.0001,
      max: 0.1,
    });

    this.hyperparameters.set('epochs', {
      name: 'epochs',
      value: 100,
      type: 'number',
      min: 1,
      max: 1000,
    });

    this.hyperparameters.set('batch_size', {
      name: 'batch_size',
      value: 32,
      type: 'number',
      min: 1,
      max: 512,
    });

    this.hyperparameters.set('optimizer', {
      name: 'optimizer',
      value: 'Adam',
      type: 'string',
      options: ['Adam', 'SGD', 'RMSprop', 'Adagrad', 'Adadelta'],
    });

    this.hyperparameters.set('momentum', {
      name: 'momentum',
      value: 0.9,
      type: 'number',
      min: 0,
      max: 1,
    });

    this.hyperparameters.set('weight_decay', {
      name: 'weight_decay',
      value: 0.0001,
      type: 'number',
      min: 0,
      max: 0.01,
    });

    this.hyperparameters.set('dropout_rate', {
      name: 'dropout_rate',
      value: 0.2,
      type: 'number',
      min: 0,
      max: 0.9,
    });

    this.hyperparameters.set('early_stopping_patience', {
      name: 'early_stopping_patience',
      value: 5,
      type: 'number',
      min: 1,
      max: 50,
    });
  }

  // Create a new hyperparameter
  createHyperparameter(hyperparameter: Hyperparameter): boolean {
    if (this.hyperparameters.has(hyperparameter.name)) {
      return false; // Hyperparameter already exists
    }

    this.hyperparameters.set(hyperparameter.name, hyperparameter);
    return true;
  }

  // Read a hyperparameter by name
  getHyperparameter(name: string): Hyperparameter | undefined {
    return this.hyperparameters.get(name);
  }

  // Get all hyperparameters
  getAllHyperparameters(): Hyperparameter[] {
    return Array.from(this.hyperparameters.values());
  }

  // Get hyperparameters as a simple object (for API/state)
  getHyperparametersAsObject(): Record<string, any> {
    const result: Record<string, any> = {};
    this.hyperparameters.forEach((hyperparameter) => {
      result[hyperparameter.name] = hyperparameter.value;
    });
    return result;
  }

  // Update a hyperparameter
  updateHyperparameter(name: string, value: any): boolean {
    const hyperparameter = this.hyperparameters.get(name);
    if (!hyperparameter) {
      return false;
    }

    // Validate value based on type and constraints
    if (hyperparameter.type === 'number') {
      const numValue = Number(value);
      if (isNaN(numValue)) return false;

      // Apply min/max constraints if they exist
      if (hyperparameter.min !== undefined && numValue < hyperparameter.min)
        return false;
      if (hyperparameter.max !== undefined && numValue > hyperparameter.max)
        return false;

      hyperparameter.value = numValue;
    } else if (hyperparameter.type === 'string' && hyperparameter.options) {
      if (!hyperparameter.options.includes(value)) return false;
      hyperparameter.value = value;
    } else {
      hyperparameter.value = value;
    }

    this.hyperparameters.set(name, hyperparameter);
    return true;
  }

  // Update multiple hyperparameters at once
  updateMultipleHyperparameters(updates: Record<string, any>): boolean {
    let allSuccessful = true;

    Object.entries(updates).forEach(([name, value]) => {
      const success = this.updateHyperparameter(name, value);
      if (!success) allSuccessful = false;
    });

    return allSuccessful;
  }

  // Delete a hyperparameter
  deleteHyperparameter(name: string): boolean {
    return this.hyperparameters.delete(name);
  }

  // Reset hyperparameters to default values
  resetToDefaults(): void {
    this.hyperparameters.clear();
    this.initializeDefaultHyperparameters();
  }

  // Import hyperparameters from an object
  importFromObject(hyperparametersObj: Record<string, any>): void {
    Object.entries(hyperparametersObj).forEach(([name, value]) => {
      const existingHyperparameter = this.hyperparameters.get(name);

      if (existingHyperparameter) {
        this.updateHyperparameter(name, value);
      } else {
        // Determine type based on value
        const type =
          typeof value === 'number'
            ? 'number'
            : typeof value === 'boolean'
              ? 'boolean'
              : 'string';

        this.createHyperparameter({
          name,
          value,
          type,
        });
      }
    });
  }
}
