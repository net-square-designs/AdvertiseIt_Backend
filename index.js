/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
// Packages
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import validator from 'express-validator';
import cors from 'cors';
import { StatusResponse } from './helpers';
// Routes
import {
  auth,
  profile,
  roles,
  services,
  bookmarks,
  messages,
  notifications,
  orders
} from './routes';

const PORT = process.env.PORT || 3005;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

app.use('/api/v1/auth', auth);
app.use('/api/v1/profile', profile);
app.use('/api/v1/role', roles);
app.use('/api/v1/services', services);
app.use('/api/v1/bookmarks', bookmarks);
app.use('/api/v1/messages', messages);
app.use('/api/v1/notifications', notifications);
app.use('/api/v1/orders', orders);

// Default to here on home route
app.get('/', (req, res) => StatusResponse.success(res, {
  status: 200,
  data: {
    message: 'Welcome to Errnd API, A platform where your errands are completed by your communities'
  }
}));

// Default to here on api/v1 route
app.get('/api/v1', (req, res) => StatusResponse.success(res, {
  status: 200,
  data: {
    message: 'Welcome to Errnd API, A platform where your errands are completed by your communities'
  }
}));

// Default to here on routes not yet available
app.use('/*', (req, res) => StatusResponse.notfound(res, {
  status: 404,
  data: {
    error: 'Endpoint does not exist ... yet'
  }
}));

export const server = app.listen(PORT, () => {
  console.log(`API live on port =>: ${PORT}`);
});

export const environment = process.env.NODE_ENV;

export default app;
