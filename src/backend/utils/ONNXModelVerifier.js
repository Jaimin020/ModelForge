/**
 * ONNX Model Verification Utility
 *
 * This utility provides functions to verify ONNX models created by ModelForge.
 * It can be integrated into the backend inference pipeline.
 */

import fs from 'fs';
import path from 'path';

/**
 * ONNX Model Verifier Class
 * Provides utilities for verifying ONNX model integrity and validity
 */
class ONNXModelVerifier {
  /**
   * Verify an ONNX model file
   * @param {string} filePath - Path to the ONNX model file
   * @returns {Object} Verification result with status and details
   */
  static verifyONNXModel(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
          timestamp: new Date().toISOString(),
        };
      }

      const buffer = fs.readFileSync(filePath);
      const stats = fs.statSync(filePath);

      const result = {
        success: true,
        filePath,
        fileSize: stats.size,
        isValid: this.validateONNXFormat(buffer),
        isBinary: this.isBinaryFormat(buffer),
        checksum: this.calculateChecksum(buffer),
        timestamp: new Date().toISOString(),
        checks: {
          fileExists: true,
          isReadable: true,
          hasContent: buffer.length > 0,
          isBinaryFormat: this.isBinaryFormat(buffer),
          fileSizeValid: stats.size >= 50 && stats.size <= 100 * 1024 * 1024,
          protobufMarkersValid: this.hasValidProtobufMarkers(buffer),
        },
      };

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Validate ONNX format
   * @param {Buffer} buffer - File buffer to validate
   * @returns {boolean} True if valid ONNX format
   */
  static validateONNXFormat(buffer) {
    if (!buffer || buffer.length < 4) {
      return false;
    }

    try {
      // Check for binary content
      return this.isBinaryFormat(buffer) && buffer.length > 0;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if buffer is in binary format
   * @param {Buffer} buffer - Buffer to check
   * @returns {boolean} True if binary format
   */
  static isBinaryFormat(buffer) {
    if (!buffer) return false;

    for (let i = 0; i < Math.min(100, buffer.length); i++) {
      if (buffer[i] === 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check for valid protobuf markers
   * @param {Buffer} buffer - Buffer to check
   * @returns {boolean} True if valid markers found
   */
  static hasValidProtobufMarkers(buffer) {
    if (!buffer || buffer.length < 2) {
      return false;
    }

    // Check for common protobuf field markers
    const hasFieldMarkers = buffer[0] > 0 && buffer[0] < 0xff;
    const hasLengthData = buffer.length > 1;

    return hasFieldMarkers && hasLengthData;
  }

  /**
   * Calculate checksum for buffer
   * @param {Buffer} buffer - Buffer to calculate checksum for
   * @returns {string} Hex-encoded checksum
   */
  static calculateChecksum(buffer) {
    if (!buffer) return '0x0';

    let checksum = 0;
    for (let i = 0; i < buffer.length; i++) {
      checksum = (checksum + buffer[i]) % 0xffffffff;
    }
    return `0x${checksum.toString(16)}`;
  }

  /**
   * Verify multiple ONNX models
   * @param {string[]} filePaths - Array of file paths to verify
   * @returns {Object[]} Array of verification results
   */
  static verifyMultipleModels(filePaths) {
    return filePaths.map((filePath) => this.verifyONNXModel(filePath));
  }

  /**
   * Find and verify all ONNX models in a directory
   * @param {string} directoryPath - Directory path to scan
   * @returns {Object} Verification results for all models found
   */
  static verifyONNXModelsInDirectory(directoryPath) {
    const results = {
      directory: directoryPath,
      modelsFound: 0,
      modelsValid: 0,
      modelsFailed: 0,
      models: [],
      timestamp: new Date().toISOString(),
    };

    try {
      const files = fs.readdirSync(directoryPath);
      const onnxFiles = files.filter((file) => file.endsWith('.onnx'));

      results.modelsFound = onnxFiles.length;

      onnxFiles.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const verification = this.verifyONNXModel(filePath);

        results.models.push({
          filename: file,
          ...verification,
        });

        if (verification.success && verification.isValid) {
          results.modelsValid++;
        } else {
          results.modelsFailed++;
        }
      });

      results.allValid = results.modelsFailed === 0;
    } catch (error) {
      results.error = error.message;
      results.allValid = false;
    }

    return results;
  }

  /**
   * Validate ONNX model after creation
   * Useful for post-training verification
   * @param {string} modelPath - Path to the created ONNX model
   * @returns {Object} Validation result
   */
  static validateCreatedONNXModel(modelPath) {
    const verification = this.verifyONNXModel(modelPath);

    if (!verification.success) {
      return {
        valid: false,
        error: verification.error,
        recommendation:
          'Model file could not be read. Check file path and permissions.',
      };
    }

    const recommendations = [];

    if (!verification.isValid) {
      recommendations.push('ONNX format validation failed');
    }

    if (!verification.isBinary) {
      recommendations.push('File does not appear to be binary ONNX format');
    }

    if (!verification.checks.fileSizeValid) {
      recommendations.push(
        `File size ${verification.fileSize} bytes is outside expected range`,
      );
    }

    if (!verification.checks.protobufMarkersValid) {
      recommendations.push('Protobuf markers validation failed');
    }

    return {
      valid: Object.values(verification.checks).every((v) => v),
      fileSize: verification.fileSize,
      checksum: verification.checksum,
      allChecksPassed: Object.values(verification.checks).every((v) => v),
      failedChecks: Object.entries(verification.checks)
        .filter(([, v]) => !v)
        .map(([k]) => k),
      recommendations,
      timestamp: verification.timestamp,
    };
  }

  /**
   * Compare two ONNX models
   * @param {string} modelPath1 - Path to first model
   * @param {string} modelPath2 - Path to second model
   * @returns {Object} Comparison result
   */
  static compareONNXModels(modelPath1, modelPath2) {
    try {
      const buffer1 = fs.readFileSync(modelPath1);
      const buffer2 = fs.readFileSync(modelPath2);
      const stats1 = fs.statSync(modelPath1);
      const stats2 = fs.statSync(modelPath2);

      const checksum1 = this.calculateChecksum(buffer1);
      const checksum2 = this.calculateChecksum(buffer2);

      return {
        identical: buffer1.equals(buffer2),
        sameName: path.basename(modelPath1) === path.basename(modelPath2),
        sameSize: stats1.size === stats2.size,
        sameChecksum: checksum1 === checksum2,
        size1: stats1.size,
        size2: stats2.size,
        checksum1,
        checksum2,
        model1: path.basename(modelPath1),
        model2: path.basename(modelPath2),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get ONNX model metadata
   * @param {string} modelPath - Path to the model
   * @returns {Object} Model metadata
   */
  static getONNXModelMetadata(modelPath) {
    try {
      const stats = fs.statSync(modelPath);
      const buffer = fs.readFileSync(modelPath);

      return {
        filename: path.basename(modelPath),
        directory: path.dirname(modelPath),
        fileSize: stats.size,
        fileSizeReadable: this.formatFileSize(stats.size),
        checksum: this.calculateChecksum(buffer),
        isBinary: this.isBinaryFormat(buffer),
        isValid: this.validateONNXFormat(buffer),
        createdTime: stats.birthtime,
        modifiedTime: stats.mtime,
        firstBytes: buffer.slice(0, 16).toString('hex'),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Format file size in human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  static formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Export verification report
   * @param {Object} verificationResult - Result from verifyONNXModel
   * @param {string} outputPath - Path to save the report
   * @returns {boolean} True if report was saved successfully
   */
  static exportVerificationReport(verificationResult, outputPath) {
    try {
      const report = {
        title: 'ONNX Model Verification Report',
        generatedAt: new Date().toISOString(),
        verificationData: verificationResult,
      };

      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      return true;
    } catch (error) {
      console.error(`Error exporting report: ${error.message}`);
      return false;
    }
  }
}

/**
 * Export for use in other modules
 */
export default ONNXModelVerifier;
