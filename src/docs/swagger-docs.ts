import fs from 'fs';
import path from 'path';
import { swaggerSpec } from './swagger';

const file = path.resolve(__dirname, '../../dist/swagger.json');
fs.writeFileSync(file, JSON.stringify(swaggerSpec, null, 2));
