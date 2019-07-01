/* eslint-disable import/no-cycle */
import express from 'express';
import { Auth } from '../controllers';
import {
  validateUserOnLogin,
  validateUserOnSignUp,
  validateUserExists,
  validateUserDoNotExists,
} from '../middlewares';

const router = express.Router();

router.post('/signup', validateUserOnSignUp, validateUserExists, Auth.signUp);
router.post('/login', validateUserOnLogin, validateUserDoNotExists, Auth.login);

export default router;
