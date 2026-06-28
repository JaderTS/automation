import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly pageTitle = this.page.locator('.title');
  private readonly inventoryItems = this.page.locator('.inventory_item');
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');
  private readonly cartLink = this.page.locator('.shopping_cart_link');
  private readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');

  constructor(page: Page) {
    super(page);
  }

  async expectPageVisible(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    const addButton = item.locator('button');
    await addButton.click();
  }

  async removeItemFromCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    const removeButton = item.locator('button');
    await removeButton.click();
  }

  async getCartCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    const badge = await this.cartBadge.textContent();
    return badge ? parseInt(badge, 10) : 0;
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.inventoryItems.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItems
      .locator('.inventory_item_price')
      .allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace('$', '')));
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
