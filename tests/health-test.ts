import request from 'supertest';
import app from '../src/app.js';

const path = '/health';

describe('Integration Tests', () => {
    describe('GET', () => {
        // GET /health ---------------------------------------------------------
        describe(path, () => {
            it('Request GET /health → Response status 200 OK', async () => {
                // Act
                const response = await request(app).get(path);
                // Assert
                expect(response.status).toBe(200);
            });
        });
    });
});
