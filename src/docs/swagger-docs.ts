import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { swaggerSpec } from './swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const file = path.resolve(__dirname, '../../dist/swagger.json');
fs.writeFileSync(file, JSON.stringify(swaggerSpec, null, 2));
