export interface Hyperparameter {
  name: string;
  value: any;
  type: 'number' | 'string' | 'boolean';
  min?: number;
  max?: number;
  options?: string[];
}
