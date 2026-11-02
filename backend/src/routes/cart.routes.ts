import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  updateCartSettings,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller';

const router = Router();

router.get('/', getCart);
router.post('/items', addItemToCart);
router.patch('/settings', updateCartSettings);
router.patch('/items/:partId', updateCartItem);
router.delete('/items/:partId', removeCartItem);
router.delete('/', clearCart);

export default router;
