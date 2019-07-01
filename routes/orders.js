/* eslint-disable import/no-cycle */
import express from 'express';
import { Orders } from '../controllers';
import {
  validateOrdersInput,
  validateTaskStatusInput,
  validateOrderStatusInput,
  validateToken
} from '../middlewares';

const router = express.Router();

router.post('/customer/:username', validateToken, validateOrdersInput, Orders.create);

router.put('/runner/:username/update/:taskId', validateToken, validateTaskStatusInput, Orders.updateStatusOfTask);

router.put('/customer/:username/update/:orderId', validateToken, validateOrderStatusInput, Orders.updateStatusOfOrder);

router.get('/runner/:username', validateToken, Orders.getAllRunnersTasks);

router.get('/runner/:username/:taskId', validateToken, Orders.getSpecificRunnersTask);

router.get('/customer/:username', validateToken, Orders.getAllCustomerOrderHistory);

router.delete('/customer/remove/:orderId', validateToken, Orders.delete);

export default router;
