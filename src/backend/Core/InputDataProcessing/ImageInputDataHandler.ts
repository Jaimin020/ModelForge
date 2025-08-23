import {
  AbstractInputDataHandler,
  InputDataResult,
  ValidationResult,
  InputType,
} from './AbstractInputDataHandler';

export class ImageInputDataHandler extends AbstractInputDataHandler {
  extractInputData(): InputDataResult {
    return {
      type: InputType.IMAGE,
      data: {
        folder_path: this.findParameter('Folder')?.value || '',
        num_classes: this.findParameter('Number of Classes')?.value || 0,
        total_images: this.findParameter('Total Images')?.value || 0,
        selected_classes: this.findParameter('Selected Classes')?.value || [],
        class_statistics: this.findParameter('Class Statistics')?.value || {},
        train_split: this.findParameter('Train Split')?.value || 0.8,
        test_split: this.findParameter('Test Split')?.value || 0.2,
        batch_size: this.getBatchSize(),
      },
    };
  }

  validateInputData(): ValidationResult {
    const errors: string[] = [];

    if (!this.findParameter('Folder')?.value) {
      errors.push('Folder path is required');
    }

    const numClasses = this.findParameter('Number of Classes')?.value;
    if (!numClasses || numClasses <= 0) {
      errors.push('At least one class must be selected');
    }

    const selectedClasses = this.findParameter('Selected Classes')?.value;
    if (!selectedClasses || selectedClasses.length === 0) {
      errors.push('Selected classes cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private getBatchSize(): number {
    return 32; // Default value
  }
}
