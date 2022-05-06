import * as express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import type { User } from '@prisma/client';
import auth from './auth';
import { RespondError, RespondSuccess } from '../utils/response';
import { Errors } from '../../shared/errors';
import creatorApp from './creator';
import postApp from './post';

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
app.use('/creator', creatorApp);
app.use('/post', postApp);

app.all('*', (req, res) =>
  RespondError(res, Errors.NOT_FOUND, {
    statusCode: 404,
    errorSummary: 'The resource you requested does not exists',
    data: {
      method: req.method,
      path: '/api' + req.url,
    },
  }),
);

export default app;
