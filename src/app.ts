import express, { Request } from 'express';
import morgan from 'morgan';
import passport from 'passport';

import { router } from './router';

import { config } from 'dotenv';

// Load passport config
const pass = require('./api/middlewares/passport.middle');
const auth = require('./api/middlewares/auth.middle');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

import cors, { CorsOptions } from 'cors';

const whiteList = ['http://localhost:3000'];
const corsOptionsDelegate = function handler(
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void,
) {
  const corsOptions: { origin: boolean } = { origin: false };

  if (whiteList.indexOf(req.header('Origin') ?? '') !== -1) {
    corsOptions.origin = true;
  }

  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(passport.initialize());

// Defining routes
app.use('/', router(app));

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: `),
);
