import { test, expect } from '../../src/fixtures';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { DataFactory } from '../../src/utils/DataFactory';
import { ERROR_MESSAGES, PRODUCTS } from '../../src/utils/constants';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    inventoryPage = new InventoryPage(authenticatedPage);
    cartPage = new CartPage(authenticatedPage);
    checkoutPage = new CheckoutPage(authenticatedPage);

    await inventoryPage.addItemToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.expectPageVisible();
  });

  test('completes full purchase flow', async () => {
    await cartPage.expectItemInCart(PRODUCTS.backpack);
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo(DataFactory.checkoutInfo());
    await checkoutPage.continue();

    const total = await checkoutPage.getTotalPrice();
    expect(total).toContain('Total:');

    await checkoutPage.finish();
    await checkoutPage.expectOrderConfirmed();
  });

  test('shows error when first name is missing', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(DataFactory.checkoutInfo({ firstName: '' }));
    await checkoutPage.continue();
    await checkoutPage.expectErrorMessage(ERROR_MESSAGES.firstNameRequired);
  });

  test('shows error when last name is missing', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(DataFactory.checkoutInfo({ lastName: '' }));
    await checkoutPage.continue();
    await checkoutPage.expectErrorMessage(ERROR_MESSAGES.lastNameRequired);
  });

  test('shows error when postal code is missing', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(DataFactory.checkoutInfo({ postalCode: '' }));
    await checkoutPage.continue();
    await checkoutPage.expectErrorMessage(ERROR_MESSAGES.postalCodeRequired);
  });

  test('continues shopping and keeps cart items', async ({ authenticatedPage }) => {
    await cartPage.continueShopping();
    inventoryPage = new InventoryPage(authenticatedPage);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('cart shows correct item count before checkout', async () => {
    expect(await cartPage.getCartItemCount()).toBe(1);
  });
});
