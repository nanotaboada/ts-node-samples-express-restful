/* -----------------------------------------------------------------------------
 * Test
 * -------------------------------------------------------------------------- */

import request from 'supertest';
import app from '../src/app';
import playerStub from './player-stub';

const path = '/players';

describe('Integration Tests', () => {
    describe('GET', () => {
        describe('/players/', () => {
            it('When request has invalid path, then response status should be 404 (Not Found)', async () => {
                const response = await request(app)
                    .get('/players-invalid-path/');
                expect(response.status).toBe(404);
            });
            it('When request has no parameters, then response status should be 200 (OK)', async () => {
                const response = await request(app)
                    .get(path);
                expect(response.status).toBe(200);
            });
            it('When request has no parameters, then response body should be collection of players', async () => {
                const players = playerStub.players;
                const response = await request(app)
                    .get(path);
                expect(response.body).toEqual(players);
            });
        });
        describe('/players/:id', () => {
            it('When request parameter does not identify a player, then response status should be 404 (Not Found)', async () => {
                const id = 999;
                const response = await request(app)
                    .get(`${path}/${id}`);
                expect(response.status).toBe(404);
            });
            it('When request parameter identifies existing player, then response status should be 200 (OK)', async () => {
                const id = 1;
                const response = await request(app)
                    .get(`${path}/${id}`);
                expect(response.status).toBe(200);
            });
            it('When request parameter identifies existing player, then response body should be matching Player', async () => {
                const id = 1;
                const player = playerStub.findById(id);
                const response = await request(app)
                    .get(`${path}/${id}`);
                expect(response.body.id).toBe(id);
                expect(response.body).toEqual(player);
            });
        });
        describe('/players/squadNumber/:squadNumber', () => {
            it('When request parameter is non-existing squad number, then response status should be 404 (Not Found)', async () => {
                const squadNumber = 999;
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                expect(response.status).toBe(404);
            });
            it('When request parameter is existing squad number, then response status should be 200 (OK)', async () => {
                const squadNumber = 10;
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                expect(response.status).toBe(200);
            });
            it('When request parameter is existing squad number, then response body should be matching Player', async () => {
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
        describe('/players', () => {
            it('When request body is empty, then response status should be 400 (Bad Request)', async () => {
                const body: Record<string, any> = {};
                const response = await request(app)
                    .post(path)
                    .send(body);
                expect(response.status).toBe(400);
            });
            it('When request is existing player, then response status should be 409 (Conflict)', async () => {
                const player = playerStub.findById(1) || undefined;
                const response = await request(app)
                    .post(path)
                    .send(player);
                expect(response.status).toBe(409);
            });
            it('When request is non-existing player, then response status should be 201 (Created)', async () => {
                const player = playerStub.player;
                const response = await request(app)
                    .post(path)
                    .send(player);
                expect(response.status).toBe(201);
            });
        });
    });
    describe('PUT', () => {
        describe('/players/:id', () => {
            it('When request body is empty, then response status should be 400 (Bad Request)', async () => {
                const id = playerStub.player.id;
                const body: Record<string, any> = {};
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                expect(response.status).toBe(400);
            });
            it('When request is non-existing player, then response status should be 404 (Not Found)', async () => {
                const id = 999;
                const player = { id: 999, firstName: 'John', lastName: 'Doe' };
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(player);
                expect(response.status).toBe(404);
            });
            it('When request is existing player, then response status should be 204 (No Content)', async () => {
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
        describe('/players/:id', () => {
            it('When request parameter is non-existing player, then response status should be 404 (Not Found)', async () => {
                const id = 999;
                const player = { id: 999, firstName: 'John', lastName: 'Doe' };
                const response = await request(app)
                    .delete(`${path}/${id}`)
                    .send(player);
                expect(response.status).toBe(404);
            });
            it('When request parameter is existing player, then response status should be 204 (No Content)', async () => {
                const id = playerStub.player.id;
                const response = await request(app)
                    .delete(`${path}/${id}`)
                    .send(playerStub.findById(1) || {});
                expect(response.status).toBe(204);
            });
        });
    });
});
