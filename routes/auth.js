/* eslint-disable import/no-cycle */
import express from 'express';
import passport from 'passport';
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
router.post('/social', Auth.socialAuth);
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/callback', passport.authenticate('facebook'), Auth.social);

export default router;
