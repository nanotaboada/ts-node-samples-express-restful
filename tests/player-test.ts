/* -----------------------------------------------------------------------------
 * Test
 * -------------------------------------------------------------------------- */

import request from 'supertest';
import app from '../src/app.js';
import playerStub from './player-stub.js';

const path = '/players';

describe('Integration Tests', () => {
    describe('GET', () => {
        // GET /players --------------------------------------------------------
        describe(path, () => {
            it('Given GET, when request has invalid path, then response status should be 404 (Not Found)', async () => {
                // Arrange
                const invalidPath = '/players-invalid-path/';
                // Act
                const response = await request(app)
                    .get(invalidPath);
                // Assert
                expect(response.status).toBe(404);
            });
            it('Given GET, when request path has no ID, then response status should be 200 (OK)', async () => {
                // Act
                const response = await request(app)
                    .get(path);
                // Assert
                expect(response.status).toBe(200);
            });
            it('Given GET, when request path has no ID, then response body should be all players', async () => {
                // Arrange
                const players = playerStub.all;
                // Act
                const response = await request(app)
                    .get(path);
                // Assert
                expect(response.body).toEqual(players);
            });
        });
        // GET /players/:id ----------------------------------------------------
        describe(`${path}/:id`, () => {
            it('Given GET, when request path is nonexistent ID, then response status should be 404 (Not Found)', async () => {
                // Arrange
                const id = 999;
                // Act
                const response = await request(app)
                    .get(`${path}/${id}`);
                // Assert
                expect(response.status).toBe(404);
            });
            it('Given GET, when request path is existing ID, then response status should be 200 (OK)', async () => {
                // Arrange
                const id = 1;
                // Act
                const response = await request(app)
                    .get(`${path}/${id}`);
                // Assert
                expect(response.status).toBe(200);
            });
            it('Given GET, when request path is existing ID, then response body should be matching Player', async () => {
                // Arrange
                const id = 1;
                const player = playerStub.findById(id);
                // Act
                const response = await request(app)
                    .get(`${path}/${id}`);
                // Assert
                expect(response.body.id).toBe(id);
                expect(response.body).toEqual(player);
            });
        });
        // GET /players/squadNumber/:squadNumber -------------------------------
        describe(`${path}/squadNumber/:squadNumber`, () => {
            it('Given GET, when request path is unknown Squad Number, then response status should be 404 (Not Found)', async () => {
                // Arrange
                const squadNumber = 999;
                // Act
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                // Assert
                expect(response.status).toBe(404);
            });
            it('Given GET, when request path is existing Squad Number, then response status should be 200 (OK)', async () => {
                // Arrange
                const squadNumber = 10;
                // Act
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                // Assert
                expect(response.status).toBe(200);
            });
            it('Given GET, when request path is existing Squad Number, then response body should be matching Player', async () => {
                // Arrange
                const squadNumber = 10;
                const player = playerStub.findBySquadNumber(squadNumber);
                // Act
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                // Assert
                expect(response.body.squadNumber).toBe(squadNumber);
                expect(response.body).toEqual(player);
            });
        });
    });
    describe('POST', () => {
        // POST /players -------------------------------------------------------
        describe(path, () => {
            it('Given POST, when request body is empty, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const body: Record<string, any> = {};
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
            });
            it('Given POST, when request body is existing Player, then response status should be 409 (Conflict)', async () => {
                // Arrange
                const body = playerStub.findById(1);
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(409);
            });
            it('Given POST, when request body is nonexistent (new) Player, then response status should be 201 (Created)', async () => {
                // Arrange
                const body = playerStub.new;
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(201);
            });
        });
    });
    describe('PUT', () => {
        // PUT /players/:id ----------------------------------------------------
        describe(`${path}/:id`, () => {
            it('Given PUT, when request body is empty, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body: Record<string, any> = {};
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
            });
            it('Given PUT, when request path is nonexistent ID, then response status should be 404 (Not Found)', async () => {
                // Arrange
                const id = 999;
                const body = { id: 999, firstName: 'John', lastName: 'Doe' };
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(404);
            });
            it('Given PUT, when request path is existing ID, then response status should be 204 (No Content)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body = playerStub.new;
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(204);
            });
        });
    });
    describe('DELETE', () => {
        // DELETE /players/:id -------------------------------------------------
        describe(`${path}/:id`, () => {
            it('Given DELETE, when request path is nonexistent ID, then response status should be 404 (Not Found)', async () => {
                // Arrange
                const id = 999;
                // Act
                const response = await request(app)
                    .delete(`${path}/${id}`)
                // Assert
                expect(response.status).toBe(404);
            });
            it('Given DELETE, when request path is existing ID, then response status should be 204 (No Content)', async () => {
                // Arrange
                const id = playerStub.new.id;
                // Act
                const response = await request(app)
                    .delete(`${path}/${id}`)
                // Assert
                expect(response.status).toBe(204);
            });
        });
    });
});
