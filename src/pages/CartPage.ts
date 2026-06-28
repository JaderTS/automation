import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  private readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');

  constructor(page: Page) {
    super(page);
  }

  async expectPageVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/cart/);
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  async expectItemInCart(name: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: name });
    await expect(item).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
