import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const basePath = process.env.BASE_PATH || path.resolve(__dirname, '..');

export const paths = {
  base: basePath,
  assets: process.env.ASSETS_PATH || path.join(basePath, 'assets'),
  venvPython:
    process.env.VENV_PYTHON_PATH?.replace('${BASE_PATH}', basePath) || '',
};
