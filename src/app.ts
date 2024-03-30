import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

/**
 * ********************************************************************************
 *  Middlewares
 * ********************************************************************************
 */

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

export default app;
