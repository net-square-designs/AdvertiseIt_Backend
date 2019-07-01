/* eslint-disable import/no-cycle */
import express from 'express';
import { Notifications } from '../controllers';
import { validateToken } from '../middlewares';

const router = express.Router();

router.get('/:notificationId', validateToken, Notifications.retrieveOne);

router.put('/update', validateToken, Notifications.update);

router.delete('/remove/:notificationId', validateToken, Notifications.delete);

router.get('/', validateToken, Notifications.retrieveAll);

export default router;
