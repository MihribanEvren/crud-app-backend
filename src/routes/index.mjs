import { Router } from 'express';
import usersRouter from './users.mjs';
import productsRouter from './products.mjs';

const router = Router();

// User Route
router.use('/api/users', usersRouter);

// Product Route
router.use('/api/products', productsRouter);

export default router;
