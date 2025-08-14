import request from 'supertest';
import { app } from '../index';
import prisma from '../index';
import { Server } from 'http';

let server: Server;

beforeAll(() => {
  server = app.listen(4000); // Iniciar el servidor en un puerto diferente para pruebas
});

afterAll(async () => {
  server.close();
  await prisma.$disconnect();
});

describe('GET /', () => {
  it('responds with Hello World!', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});
