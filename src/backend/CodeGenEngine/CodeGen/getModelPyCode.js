import { modelTemplate } from '../utils/pyTorch/Model.js';
import * as ejs from 'ejs';

export function getModelPyCode(modelData) {
  // Render the template with JSON data
  const pythonCode = ejs.render(modelTemplate, modelData);
  console.log(pythonCode);
}
