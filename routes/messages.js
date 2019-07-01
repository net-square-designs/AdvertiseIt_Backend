/* eslint-disable import/no-cycle */
import express from 'express';
import { Messages } from '../controllers';
import { validateMessagesInput, validateToken } from '../middlewares';

const router = express.Router();

router.post('/send/:username', validateMessagesInput, validateToken, Messages.send);

router.get('/:username', validateToken, Messages.retrieveConversation);

router.put('/update/:username', validateToken, Messages.updateConversation);

router.delete('/remove/:username', validateToken, Messages.deleteConversation);

router.delete('/remove', validateToken, Messages.deleteAllConversation);

router.get('/', validateToken, Messages.retrieveAllConversation);

export default router;
