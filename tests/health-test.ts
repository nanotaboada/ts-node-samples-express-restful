/* -----------------------------------------------------------------------------
 * Test
 * -------------------------------------------------------------------------- */

import request from 'supertest';
import app from '../src/app.js';

const path = '/health';

describe('Integration Tests', () => {
    describe('GET', () => {
        // GET /players --------------------------------------------------------
        describe(path, () => {
            it('Given GET, when request, then response status should be 200 (OK)', async () => {
                // Act
                const response = await request(app).get(path);
                // Assert
                expect(response.status).toBe(200);
            });
        });
    });
});
