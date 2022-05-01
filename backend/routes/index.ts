import * as express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import type { User } from '@prisma/client';
import auth from './auth';
import { RespondSuccess } from '../utils/response';

declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}

const app = express.Router();

app.use(session({ secret: '1234', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => RespondSuccess(res, 'Hello world'));

app.use('/auth', auth);

export default app;
