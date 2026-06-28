import { APIRequestContext } from '@playwright/test';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
  };
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
}

export class UsersApi {
  constructor(private readonly request: APIRequestContext) {}

  async getUsers() {
    const response = await this.request.get('/users');
    return { response, body: (await response.json()) as User[] };
  }

  async getUserById(id: number) {
    const response = await this.request.get(`/users/${id}`);
    const body = response.status() === 200 ? ((await response.json()) as User) : null;
    return { response, body };
  }

  async getUserPosts(userId: number) {
    const response = await this.request.get(`/users/${userId}/posts`);
    return { response, body: (await response.json()) as Post[] };
  }

  async createUser(payload: CreateUserPayload) {
    const response = await this.request.post('/users', { data: payload });
    return { response, body: (await response.json()) as User & { id: number } };
  }

  async updateUser(id: number, payload: Partial<CreateUserPayload>) {
    const response = await this.request.put(`/users/${id}`, { data: payload });
    return { response, body: (await response.json()) as User };
  }

  async patchUser(id: number, payload: Partial<CreateUserPayload>) {
    const response = await this.request.patch(`/users/${id}`, { data: payload });
    return { response, body: (await response.json()) as User };
  }

  async deleteUser(id: number) {
    const response = await this.request.delete(`/users/${id}`);
    return { response };
  }
}
