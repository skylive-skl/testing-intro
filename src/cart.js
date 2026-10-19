function notImplemented() {
  throw new Error('Корзина ещё не реализована. Сначала прочитайте тесты.');
}

function validateQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError('Количество должно быть положительным целым числом');
  }
  if (quantity > stock) {
    throw new RangeError(`На складе осталось только ${stock} шт.`);
  }
}

function addToCart(cart, product, quantity = 1) {
  const existingItem = cart.find((item) => item.id === product.id);
  const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

  validateQuantity(quantity, product.stock);
  validateQuantity(newQuantity, product.stock);

  if (!existingItem) return [...cart, { ...product, quantity }];
  return cart.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item));
}

function changeQuantity(cart, productId, quantity) {
  const existingItem = cart.find((item) => item.id === productId);
  if (!existingItem) return [...cart];

  validateQuantity(quantity, existingItem.stock);
  return cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal() { return notImplemented(); }
function calculateOrderTotal() { return notImplemented(); }

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
