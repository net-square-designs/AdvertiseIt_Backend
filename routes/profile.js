/* eslint-disable import/no-cycle */
import express from 'express';
import { Profile } from '../controllers';
import { validateUsersProfileExists, validateToken } from '../middlewares';

const router = express.Router();

router.get('/:username', validateUsersProfileExists, Profile.viewProfile);

router.post('/:username', validateToken, Profile.createProfile);

export default router;
