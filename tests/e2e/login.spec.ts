import { test, expect } from '../../src/fixtures';
import { CREDENTIALS, ERROR_MESSAGES } from '../../src/utils/constants';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('logs in with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(CREDENTIALS.standard.username, CREDENTIALS.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('shows error for locked-out user', async ({ loginPage }) => {
    await loginPage.login(CREDENTIALS.locked.username, CREDENTIALS.locked.password);
    await loginPage.expectErrorMessage(ERROR_MESSAGES.lockedUser);
  });

  test('shows error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.expectErrorMessage(ERROR_MESSAGES.invalidCredentials);
  });

  test('shows error when username is empty', async ({ loginPage }) => {
    await loginPage.login('', CREDENTIALS.standard.password);
    await loginPage.expectErrorMessage('Username is required');
  });

  test('shows error when password is empty', async ({ loginPage }) => {
    await loginPage.login(CREDENTIALS.standard.username, '');
    await loginPage.expectErrorMessage('Password is required');
  });

  test('login page is accessible on load', async ({ loginPage }) => {
    await loginPage.expectLoginPageVisible();
  });
});
