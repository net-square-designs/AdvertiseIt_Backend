/* eslint-disable import/no-cycle */
import express from 'express';
import { Roles } from '../controllers';
import { validateUsersProfileExists, validateToken } from '../middlewares';

const router = express.Router();

router.put('/:username', validateUsersProfileExists, validateToken, Roles.switchRole);

export default router;
