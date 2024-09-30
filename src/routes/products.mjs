import { Router } from 'express';
import { getProducts } from '../controllers/productController.mjs';

const router = Router();

router.get('/', getProducts);

export default router;
