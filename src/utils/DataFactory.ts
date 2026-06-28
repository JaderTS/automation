import { CheckoutInfo } from '../pages/CheckoutPage';

export class DataFactory {
  static checkoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
    return {
      firstName: 'Jane',
      lastName: 'Doe',
      postalCode: '10001',
      ...overrides,
    };
  }

  static randomEmail(): string {
    const ts = Date.now();
    return `test.user.${ts}@example.com`;
  }

  static randomName(): string {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];
    return names[Math.floor(Math.random() * names.length)];
  }
}
