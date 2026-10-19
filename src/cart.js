const PROMO_CODE = 'SAVE10';
const PROMO_DISCOUNT_RATE = 0.1;
const PROMO_MIN_SUBTOTAL = 20000;
const FREE_DELIVERY_MIN_SUBTOTAL = 50000;
const DELIVERY_PRICE = 30000;

function validateQuantity(quantity, stock) {
  const isPositiveInteger = Number.isInteger(quantity) && quantity > 0;

  if (!isPositiveInteger) {
    throw new RangeError('Количество должно быть положительным целым числом');
  }

  if (quantity > stock) {
    throw new RangeError(`На складе осталось только ${stock} шт.`);
  }
}

function findCartItem(cart, productId) {
  return cart.find((item) => item.id === productId);
}

function setItemQuantity(cart, productId, quantity) {
  return cart.map((item) => {
    if (item.id !== productId) return item;
    return { ...item, quantity };
  });
}

function addToCart(cart, product, quantity = 1) {
  validateQuantity(quantity, product.stock);

  const existingItem = findCartItem(cart, product.id);

  if (!existingItem) {
    return [...cart, { ...product, quantity }];
  }

  const totalQuantity = existingItem.quantity + quantity;
  validateQuantity(totalQuantity, product.stock);

  return setItemQuantity(cart, product.id, totalQuantity);
}

function changeQuantity(cart, productId, quantity) {
  const existingItem = findCartItem(cart, productId);

  if (!existingItem) {
    return [...cart];
  }

  validateQuantity(quantity, existingItem.stock);

  return setItemQuantity(cart, productId, quantity);
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateDiscount(subtotal, promoCode) {
  const isValidCode = promoCode.trim() === PROMO_CODE;
  const isEnoughSubtotal = subtotal >= PROMO_MIN_SUBTOTAL;

  if (!isValidCode || !isEnoughSubtotal) return 0;

  return Math.round(subtotal * PROMO_DISCOUNT_RATE);
}

function calculateDelivery(subtotal) {
  if (subtotal >= FREE_DELIVERY_MIN_SUBTOTAL) return 0;

  return DELIVERY_PRICE;
}

function calculateOrderTotal(cart, promoCode = '') {
  const subtotal = calculateCartSubtotal(cart);
  const discount = calculateDiscount(subtotal, promoCode);
  const delivery = calculateDelivery(subtotal);
  const total = subtotal - discount + delivery;

  return { subtotal, discount, delivery, total };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
