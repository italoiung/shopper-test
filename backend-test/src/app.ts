import express from 'express';
import * as routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();

app.use(express.json());

app.post('/upload', routes.upload);

app.patch('/confirm', routes.confirm);

app.get('/:customerId/list', routes.list);
