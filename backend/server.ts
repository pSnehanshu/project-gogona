import 'dotenv/config';
import express from 'express';
import { join } from 'path';
import proxy from 'express-http-proxy';
import routes from './routes';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use('/api', routes);
app.get(
  '*',
  isProduction
    ? express.static(join(__dirname, '..', 'frontend', 'build'))
    : proxy('http://localhost:2344'),
);

app.all('*', (req, res) => res.sendStatus(404));

const port = process.env.PORT || 2343;
app.listen(port, () => console.log('gogona is running on port', port));
