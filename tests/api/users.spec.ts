import { test, expect } from '@playwright/test';
import { UsersApi } from '../../src/api/UsersApi';

test.describe('Users API', () => {
  let api: UsersApi;

  test.beforeEach(({ request }) => {
    api = new UsersApi(request);
  });

  test.describe('GET /users', () => {
    test('returns 200 with array of users', async () => {
      const { response, body } = await api.getUsers();

      expect(response.status()).toBe(200);
      expect(body.length).toBeGreaterThan(0);
    });

    test('each user has required fields', async () => {
      const { body } = await api.getUsers();

      for (const user of body) {
        expect(user).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          username: expect.any(String),
          email: expect.stringContaining('@'),
          phone: expect.any(String),
          website: expect.any(String),
        });
      }
    });

    test('returns exactly 10 users', async () => {
      const { body } = await api.getUsers();
      expect(body).toHaveLength(10);
    });
  });

  test.describe('GET /users/:id', () => {
    test('returns a single user by id', async () => {
      const { response, body } = await api.getUserById(1);

      expect(response.status()).toBe(200);
      expect(body?.id).toBe(1);
      expect(body?.email).toBeTruthy();
    });

    test('returns 404 for non-existent user', async () => {
      const { response } = await api.getUserById(9999);
      expect(response.status()).toBe(404);
    });
  });

  test.describe('GET /users/:id/posts', () => {
    test('returns posts for a user', async () => {
      const { response, body } = await api.getUserPosts(1);

      expect(response.status()).toBe(200);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0].userId).toBe(1);
    });

    test('each post has title and body', async () => {
      const { body } = await api.getUserPosts(1);

      for (const post of body) {
        expect(post.title).toBeTruthy();
        expect(post.body).toBeTruthy();
      }
    });
  });

  test.describe('POST /users', () => {
    test('creates a user and returns 201', async () => {
      const payload = { name: 'Jane Doe', username: 'janedoe', email: 'jane@example.com' };
      const { response, body } = await api.createUser(payload);

      expect(response.status()).toBe(201);
      expect(body.name).toBe(payload.name);
      expect(body.email).toBe(payload.email);
      expect(body.id).toBeTruthy();
    });
  });

  test.describe('PUT /users/:id', () => {
    test('replaces a user and returns 200', async () => {
      const payload = { name: 'Updated Name', username: 'updated', email: 'updated@example.com' };
      const { response, body } = await api.updateUser(1, payload);

      expect(response.status()).toBe(200);
      expect(body.name).toBe(payload.name);
    });
  });

  test.describe('PATCH /users/:id', () => {
    test('partially updates a user and returns 200', async () => {
      const { response, body } = await api.patchUser(1, { name: 'Patched Name' });

      expect(response.status()).toBe(200);
      expect(body.name).toBe('Patched Name');
    });
  });

  test.describe('DELETE /users/:id', () => {
    test('deletes a user and returns 200', async () => {
      const { response } = await api.deleteUser(1);
      expect(response.status()).toBe(200);
    });
  });
});
