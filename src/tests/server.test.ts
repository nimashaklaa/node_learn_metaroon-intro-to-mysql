import request from 'supertest';
import {app, server} from '../server';

afterAll(async () => {
    // close the server
    server.close();
})

describe('GET /', () => {
    it('should respond with a message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Hello World!' });
    });
});