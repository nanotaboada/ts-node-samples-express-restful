/* -----------------------------------------------------------------------------
 * Test
 * -------------------------------------------------------------------------- */

import request from 'supertest';
import app from '../src/app';
import playerStub from './player-stub';

const path = '/players';

describe('Integration Tests', () => {
    describe('GET', () => {
        describe(path, () => {
            it('Given GET, when request has invalid path, then response status should be 404 (Not Found)', async () => {
                const response = await request(app)
                    .get('/players-invalid-path/');
                expect(response.status).toBe(404);
            });
            it('Given GET, when request path has no Id, then response status should be 200 (OK)', async () => {
                const response = await request(app)
                    .get(path);
                expect(response.status).toBe(200);
            });
            it('Given GET, when request path has no Id, then response body should be the collection of players', async () => {
                const players = playerStub.players;
                const response = await request(app)
                    .get(path);
                expect(response.body).toEqual(players);
            });
        });
        describe(`${path}/:id`, () => {
            it('Given GET, when request path is nonexistent Id, then response status should be 404 (Not Found)', async () => {
                const id = 999;
                const response = await request(app)
                    .get(`${path}/${id}`);
                expect(response.status).toBe(404);
            });
            it('Given GET, when request path is existing Id, then response status should be 200 (OK)', async () => {
                const id = 1;
                const response = await request(app)
                    .get(`${path}/${id}`);
                expect(response.status).toBe(200);
            });
            it('Given GET, when request path is existing Id, then response body should be matching Player', async () => {
                const id = 1;
                const player = playerStub.findById(id);
                const response = await request(app)
                    .get(`${path}/${id}`);
                expect(response.body.id).toBe(id);
                expect(response.body).toEqual(player);
            });
        });
        describe(`${path}/squadNumber/:squadNumber`, () => {
            it('Given GET, when request path is nonexistent Squad Number, then response status should be 404 (Not Found)', async () => {
                const squadNumber = 999;
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                expect(response.status).toBe(404);
            });
            it('Given GET, when request path is existing Squad Number, then response status should be 200 (OK)', async () => {
                const squadNumber = 10;
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                expect(response.status).toBe(200);
            });
            it('Given GET, when request path is existing Squad Number, then response body should be matching Player', async () => {
                const squadNumber = 10;
                const player = playerStub.findBySquadNumber(squadNumber);
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                expect(response.body.squadNumber).toBe(squadNumber);
                expect(response.body).toEqual(player);
            });
        });
    });
    describe('POST', () => {
        describe(path, () => {
            it('Given POST, when request body is empty, then response status should be 400 (Bad Request)', async () => {
                const body: Record<string, any> = {};
                const response = await request(app)
                    .post(path)
                    .send(body);
                expect(response.status).toBe(400);
            });
            it('Given POST, when request body is existing Player, then response status should be 409 (Conflict)', async () => {
                const player = playerStub.findById(1) || undefined;
                const response = await request(app)
                    .post(path)
                    .send(player);
                expect(response.status).toBe(409);
            });
            it('Given POST, when request body is nonexistent Player, then response status should be 201 (Created)', async () => {
                const player = playerStub.player;
                const response = await request(app)
                    .post(path)
                    .send(player);
                expect(response.status).toBe(201);
            });
        });
    });
    describe('PUT', () => {
        describe(`${path}/:id`, () => {
            it('Given PUT, when request body is empty, then response status should be 400 (Bad Request)', async () => {
                const id = playerStub.player.id;
                const body: Record<string, any> = {};
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                expect(response.status).toBe(400);
            });
            it('Given PUT, when request body is unknown Player, then response status should be 404 (Not Found)', async () => {
                const id = 999;
                const player = { id: 999, firstName: 'John', lastName: 'Doe' };
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(player);
                expect(response.status).toBe(404);
            });
            it('Given PUT, when request body is existing Player, then response status should be 204 (No Content)', async () => {
                const player = playerStub.player;
                const id = playerStub.player.id;
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(player || {});
                expect(response.status).toBe(204);
            });
        });
    });
    describe('DELETE', () => {
        describe(`${path}/:id`, () => {
            it('Given DELETE, when request path is nonexistent Id, then response status should be 404 (Not Found)', async () => {
                const id = 999;
                const player = { id: 999, firstName: 'John', lastName: 'Doe' };
                const response = await request(app)
                    .delete(`${path}/${id}`)
                    .send(player);
                expect(response.status).toBe(404);
            });
            it('Given DELETE, when request path is existing Id, then response status should be 204 (No Content)', async () => {
                const id = playerStub.player.id;
                const response = await request(app)
                    .delete(`${path}/${id}`)
                    .send(playerStub.findById(1) || {});
                expect(response.status).toBe(204);
            });
        });
    });
});
