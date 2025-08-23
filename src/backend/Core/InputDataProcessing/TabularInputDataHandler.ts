import {
  AbstractInputDataHandler,
  InputDataResult,
  ValidationResult,
  InputType,
} from './AbstractInputDataHandler';

export class TabularInputDataHandler extends AbstractInputDataHandler {
  extractInputData(): InputDataResult {
    const selectedFeatures =
      this.findParameter('Selected Feature')?.value || [];

    return {
      type: InputType.TABULAR,
      data: {
        file_name: this.findParameter('File')?.value || '',
        train_split: this.findParameter('Train Split')?.value || 0.8,
        test_split: this.findParameter('Test Split')?.value || 0.2,
        features: this.processFeatures(selectedFeatures),
        predictor: this.findParameter('Selected Predictor')?.value || [],
        batch_size: this.getBatchSize(),
      },
    };
  }

  validateInputData(): ValidationResult {
    const errors: string[] = [];

    if (!this.findParameter('File')?.value) {
      errors.push('File parameter is required');
    }

    if (!this.findParameter('Selected Feature')?.value?.length) {
      errors.push('At least one feature must be selected');
    }

    if (!this.findParameter('Selected Predictor')?.value) {
      errors.push('Predictor must be selected');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private processFeatures(selectedFeatures: any): string[] {
    if (Array.isArray(selectedFeatures)) {
      return selectedFeatures.map((f) => this.cleanFeatureName(f));
    }
    return [this.cleanFeatureName(selectedFeatures)];
  }

  private cleanFeatureName(feature: string): string {
    return decodeURIComponent(feature)
      .replace(/&#34;/g, '"')
      .replace(/['"]/g, '');
  }

  private getBatchSize(): number {
    // This would need to be passed from hyperparameters
    return 32; // Default value
  }
}
