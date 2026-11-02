import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Cart, CartDocument, ICartItem, WarrantyPlanType } from '../models/Cart.model';
import { Part, PartCondition } from '../models/Part.model';
import { ApiResponse } from '../utils/ApiResponse';
import { verifyJwt } from '../utils/token';

const WARRANTY_PRICES: Record<WarrantyPlanType, number> = {
  standard: 0,
  extended_3yr: 89,
  lifetime_pro: 149,
};

function getWarrantyPrice(plan?: string): { plan: WarrantyPlanType; price: number } {
  if (plan === 'extended_3yr' || plan === 'lifetime_pro') {
    return { plan, price: WARRANTY_PRICES[plan] };
  }
  return { plan: 'standard', price: 0 };
}

function resolveIdentifiers(req: Request): { userId?: string; sessionId: string } {
  let userId: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const payload = verifyJwt(authHeader.slice(7).trim());
    if (payload?.sub && mongoose.Types.ObjectId.isValid(payload.sub)) {
      userId = payload.sub;
    }
  }

  const headerSession =
    typeof req.headers['x-cart-session-id'] === 'string'
      ? req.headers['x-cart-session-id'].trim()
      : '';
  const querySession =
    typeof req.query.sessionId === 'string' ? req.query.sessionId.trim() : '';
  const bodySession =
    req.body && typeof req.body.sessionId === 'string' ? req.body.sessionId.trim() : '';

  const sessionId = headerSession || querySession || bodySession || (userId ? `user_${userId}` : 'guest_default');
  return { userId, sessionId };
}

async function findOrCreateCart(req: Request): Promise<CartDocument> {
  const { userId, sessionId } = resolveIdentifiers(req);

  let cart: CartDocument | null = null;
  if (userId) {
    cart = await Cart.findOne({
      $or: [{ userId: new mongoose.Types.ObjectId(userId) }, { sessionId }],
    });
  } else {
    cart = await Cart.findOne({ sessionId });
  }

  if (!cart) {
    cart = await Cart.create({
      userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      sessionId,
      items: [],
      shippingType: 'commercial',
    });
  } else if (userId && !cart.userId) {
    cart.userId = new mongoose.Types.ObjectId(userId);
    await cart.save();
  }

  return cart;
}

function serializeCart(cart: CartDocument) {
  const items = cart.items.map((item) => ({
    partId: item.partId,
    part: item.part,
    sku: item.sku || `GU-${item.partId.slice(-6).toUpperCase()}`,
    make: item.make || '',
    model: item.model || '',
    year: item.year,
    condition: item.condition || 'new',
    category: item.category || 'Auto Part',
    description: item.description || '',
    image: item.image || '',
    price: Number(item.price),
    quantity: Number(item.quantity),
    vin: item.vin || '',
    warrantyPlan: item.warrantyPlan || 'standard',
    warrantyPrice: Number(item.warrantyPrice || 0),
    lineSubtotal: Number((item.price + (item.warrantyPrice || 0)) * item.quantity),
  }));

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const partsSubtotal = Number(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  const warrantyTotal = Number(
    items.reduce((acc, item) => acc + item.warrantyPrice * item.quantity, 0).toFixed(2)
  );
  const shippingCost =
    items.length === 0 ? 0 : cart.shippingType === 'residential' ? 49 : 0;
  const grandTotal = Number((partsSubtotal + warrantyTotal + shippingCost).toFixed(2));

  return {
    id: String(cart._id),
    sessionId: cart.sessionId,
    userId: cart.userId ? String(cart.userId) : null,
    shippingType: cart.shippingType || 'commercial',
    customerVin: cart.customerVin || '',
    items,
    summary: {
      totalQuantity,
      partsSubtotal,
      warrantyTotal,
      coreChargeTotal: 0,
      shippingCost,
      grandTotal,
    },
    updatedAt: cart.updatedAt,
  };
}

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = await findOrCreateCart(req);
    ApiResponse.success(res, { cart: serializeCart(cart) }, 'Cart retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      partId,
      part,
      sku,
      make,
      model,
      year,
      condition,
      category,
      description,
      image,
      price,
      quantity = 1,
      vin,
      warrantyPlan,
    } = req.body ?? {};

    if (!partId || typeof partId !== 'string') {
      ApiResponse.error(res, 'partId is required to add an item to the cart.', 400);
      return;
    }

    const parsedQty = Math.max(1, Number(quantity) || 1);
    const { plan: resolvedWarrantyPlan, price: resolvedWarrantyPrice } =
      getWarrantyPrice(warrantyPlan);

    let itemData: Omit<ICartItem, 'quantity'> | null = null;

    // If partId is a MongoDB ObjectId, try to load authoritative details from the database parts collection
    if (mongoose.Types.ObjectId.isValid(partId)) {
      const dbPart = await Part.findById(partId);
      if (dbPart) {
        itemData = {
          partId: String(dbPart._id),
          part: dbPart.part,
          sku: sku || `DB-${String(dbPart._id).slice(-6).toUpperCase()}`,
          make: dbPart.make,
          model: dbPart.model,
          year: dbPart.year,
          condition: dbPart.condition,
          category: category || `${dbPart.make} OEM / Performance Part`,
          description: dbPart.description || '',
          image: dbPart.images?.[0] || image || '',
          price: dbPart.price,
          vin: typeof vin === 'string' ? vin.trim().toUpperCase() : '',
          warrantyPlan: resolvedWarrantyPlan,
          warrantyPrice: resolvedWarrantyPrice,
        };
      }
    }

    // Fallback to payload fields (for catalog products or custom items)
    if (!itemData) {
      if (!part || typeof part !== 'string' || typeof Number(price) !== 'number' || Number.isNaN(Number(price))) {
        ApiResponse.error(res, 'Valid part name and price are required.', 400);
        return;
      }

      const validCondition: PartCondition =
        condition === 'refurbished' || condition === 'used' ? condition : 'new';

      itemData = {
        partId: partId.trim(),
        part: part.trim(),
        sku: typeof sku === 'string' && sku.trim() ? sku.trim() : `GU-${partId.trim().toUpperCase()}`,
        make: typeof make === 'string' ? make.trim() : '',
        model: typeof model === 'string' ? model.trim() : '',
        year: year ? Number(year) : undefined,
        condition: validCondition,
        category: typeof category === 'string' ? category.trim() : 'Auto Part',
        description: typeof description === 'string' ? description.trim() : '',
        image: typeof image === 'string' ? image.trim() : '',
        price: Number(price),
        vin: typeof vin === 'string' ? vin.trim().toUpperCase() : '',
        warrantyPlan: resolvedWarrantyPlan,
        warrantyPrice: resolvedWarrantyPrice,
      };
    }

    const cart = await findOrCreateCart(req);
    const existingIndex = cart.items.findIndex((i) => i.partId === itemData!.partId);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += parsedQty;
      if (vin && typeof vin === 'string') {
        cart.items[existingIndex].vin = vin.trim().toUpperCase();
      }
      if (warrantyPlan) {
        cart.items[existingIndex].warrantyPlan = resolvedWarrantyPlan;
        cart.items[existingIndex].warrantyPrice = resolvedWarrantyPrice;
      }
    } else {
      cart.items.push({
        ...itemData,
        quantity: parsedQty,
      });
    }

    await cart.save();

    ApiResponse.success(
      res,
      { cart: serializeCart(cart) },
      `"${itemData.part}" has been added to your cart.`,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { partId } = req.params;
    const { quantity, vin, warrantyPlan } = req.body ?? {};

    const cart = await findOrCreateCart(req);
    const itemIndex = cart.items.findIndex((i) => i.partId === partId);

    if (itemIndex === -1) {
      ApiResponse.error(res, 'Part not found in cart.', 404);
      return;
    }

    if (quantity !== undefined) {
      const parsedQty = Number(quantity);
      if (parsedQty <= 0) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
        ApiResponse.success(res, { cart: serializeCart(cart) }, 'Item removed from cart.');
        return;
      }
      cart.items[itemIndex].quantity = Math.floor(parsedQty);
    }

    if (typeof vin === 'string') {
      cart.items[itemIndex].vin = vin.trim().toUpperCase();
    }

    if (typeof warrantyPlan === 'string') {
      const { plan, price } = getWarrantyPrice(warrantyPlan);
      cart.items[itemIndex].warrantyPlan = plan;
      cart.items[itemIndex].warrantyPrice = price;
    }

    await cart.save();
    ApiResponse.success(res, { cart: serializeCart(cart) }, 'Cart item updated.');
  } catch (error) {
    next(error);
  }
};

export const updateCartSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { shippingType, customerVin } = req.body ?? {};
    const cart = await findOrCreateCart(req);

    if (shippingType === 'commercial' || shippingType === 'residential') {
      cart.shippingType = shippingType;
    }
    if (typeof customerVin === 'string') {
      cart.customerVin = customerVin.trim().toUpperCase();
    }

    await cart.save();
    ApiResponse.success(res, { cart: serializeCart(cart) }, 'Cart preferences updated.');
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { partId } = req.params;
    const cart = await findOrCreateCart(req);

    cart.items = cart.items.filter((item) => item.partId !== partId);
    await cart.save();

    ApiResponse.success(res, { cart: serializeCart(cart) }, 'Part removed from cart.');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = await findOrCreateCart(req);
    cart.items = [];
    await cart.save();

    ApiResponse.success(res, { cart: serializeCart(cart) }, 'Cart cleared.');
  } catch (error) {
    next(error);
  }
};
