import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const paths = {
  base: process.env.BASE_PATH || path.resolve(__dirname, '..'),
  assets: process.env.ASSETS_PATH || path.join(process.env.BASE_PATH || '', 'assets')
};