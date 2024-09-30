import { Router } from 'express';
import { resolveIndexByUserId } from '../middleware/findUser.mjs';
import { checkSchema } from 'express-validator';
import {
  createUserValidationSchema,
  filterValidationSchema,
} from '../utils/validationSchemas.mjs';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserField,
} from '../controllers/userController.mjs';

const router = Router();

// Get all Users
router.get('/', checkSchema(filterValidationSchema), getUsers);

// Get single User
router.get('/:id', resolveIndexByUserId, getUser);

// Create new User
router.post('/', checkSchema(createUserValidationSchema), createUser);

// Update User
router.put('/:id', resolveIndexByUserId, updateUser);

router.patch('/:id', resolveIndexByUserId, updateUserField);

// Delete User
router.delete('/:id', resolveIndexByUserId, deleteUser);

export default router;
