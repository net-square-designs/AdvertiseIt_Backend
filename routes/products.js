/* eslint-disable import/no-cycle */
import express from 'express';
import { Products } from '../controllers';
import { validateProductsInput, validateToken, validateSearchUrl } from '../middlewares';

const router = express.Router();

router.get('/search', validateSearchUrl, Products.search);

router.post('/:username', validateProductsInput, validateToken, Products.create);

router.put('/:username/update/:productId', validateToken, Products.update);

router.put('/:username/archive/:productId', validateToken, Products.archive);

router.put('/:username/unarchive/:productId', validateToken, Products.unArchive);

router.delete('/:username/remove/:productId', validateToken, Products.delete);

router.get('/:username/specific/:productId', Products.getSpecificProductOfAUser);

router.get('/:username/archived', validateToken, Products.getAUsersArchivedProducts);

router.get('/all/:username', Products.getAllUsersProducts);

router.get('/', Products.getAllProducts);

export default router;
