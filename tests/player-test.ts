/* -----------------------------------------------------------------------------
 * Test
 * -------------------------------------------------------------------------- */

import request from 'supertest';
import app from '../src/app';
import { player10 } from './fixtures/player-fixture';

describe('Integration Tests', () => {
    describe('HTTP GET', () => {
        describe('/players', () => {
            it('When request has no parameters, then response status code should be 200 (OK)', async () => {
                const response = await request(app).get('/players');
                expect(response.status).toBe(200);
            });

            it('When request has invalid path, then response status code should be 404 (Not Found)', async () => {
                const response = await request(app).get('/players-invalid-path');
                expect(response.status).toBe(404);
            });
        });
        describe('/players/:squadNumber', () => {
            it('When request parameter identifies existing Player, then response status code should be 200 (OK)', async () => {
                const response = await request(app).get('/players/squadNumber/10');
                expect(response.status).toBe(200);
            });
        });
        it('When request parameter identifies existing Player, then response body should be the Player', async () => {
            const response = await request(app).get('/players/squadNumber/10');
            expect(response.body).toEqual(player10);
        });
        it('When request parameter does not identify existing Player, then response status code should be 404 (Not Found)', async () => {
            const response = await request(app).get('/players//squadNumber/42');
            expect(response.status).toBe(404);
        });
    });
});
