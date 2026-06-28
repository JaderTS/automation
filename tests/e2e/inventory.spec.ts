import { test, expect } from '../../src/fixtures';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { PRODUCTS } from '../../src/utils/constants';

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.expectPageVisible();
  });

  test('displays 6 products', async () => {
    expect(await inventoryPage.getItemCount()).toBe(6);
  });

  test('adds item to cart and updates badge', async () => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('adds multiple items to cart', async () => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack);
    await inventoryPage.addItemToCartByName(PRODUCTS.bikeLight);
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('removes item from cart', async () => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack);
    await inventoryPage.removeItemFromCartByName(PRODUCTS.backpack);
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('sorts products A to Z', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort());
  });

  test('sorts products Z to A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sorts products by price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts products by price high to low', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
