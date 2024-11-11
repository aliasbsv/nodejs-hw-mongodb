import { env } from '../utils/env.js';
import path from 'node:path';
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAY = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
  SMTP_HOST: env('SMTP_HOST'),
  SMTP_PORT: Number(env('SMTP_PORT')),
  SMTP_USER: env('SMTP_USER'),
  SMTP_PASSWORD: env('SMTP_PASSWORD'),
  SMTP_FROM: env('SMTP_FROM'),
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const RESET_PWD_PATH = path.join(TEMPLATES_DIR, 'reset-password.html');

export const CLOUDINARY = {
  CLOUD_NAME: env('CLOUD_NAME'),
  API_KEY: env('API_KEY'),
  API_SECRET: env('API_SECRET'),
};

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
