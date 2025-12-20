import request from 'supertest';
import app from '../src/app.js';
import playerStub from './player-stub.js';

const path = '/players';

/**
 * Helper function to check if an error exists for a specific field.
 */
const hasFieldError = (errors: any[], fieldName: string): boolean => {
    return errors.some((e: any) => e.path === fieldName);
};

describe('Integration Tests', () => {
    afterEach(async () => {
        const response = await request(app).delete(`${path}/${playerStub.new.id}`);
        if (response.status !== 204 && response.status !== 404) {
            throw new Error(`Cleanup failed with status ${response.status}`);
        }
    });

    describe('GET', () => {
        it('Given GET, when request within rate limit, then response should include standard rate limit headers', async () => {
            // Skip if rate limiting is disabled
            if (process.env.RATE_LIMIT_ENABLED === 'false') {
                expect(true).toBe(true);
                return;
            }

            // Act
            const response = await request(app).get('/players');
            // Assert
            expect(response.headers).toHaveProperty('ratelimit-limit');
            expect(response.headers).toHaveProperty('ratelimit-remaining');
            expect(response.headers).toHaveProperty('ratelimit-reset');
        });
        it('Given GET, when request within rate limit, then response should NOT include legacy X-RateLimit headers', async () => {
            // Act
            const response = await request(app).get('/players');
            // Assert
            expect(response.headers).not.toHaveProperty('x-ratelimit-limit');
            expect(response.headers).not.toHaveProperty('x-ratelimit-remaining');
        });
        it('Given GET, when multiple requests exceed rate limit, then response status should be 429 (Too Many Requests)', async () => {
            // This test is skipped by default as it requires making 100+ requests
            // To enable, set RATE_LIMIT_MAX_GENERAL to a lower value (e.g., 10) in test environment
            const maxRequests = Number.parseInt(process.env.RATE_LIMIT_MAX_GENERAL || '100', 10);

            // Skip if using high default limit
            if (maxRequests > 50) {
                expect(true).toBe(true); // Skip test
                return;
            }

            // Act - Make requests up to the limit using health endpoint
            for (let i = 0; i < maxRequests; i++) {
                await request(app).get('/health');
            }

            // Assert - The next request should be rate limited
            const response = await request(app).get('/health');
            expect(response.status).toBe(429);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Too many requests');
        }, 30000); // Increase timeout for multiple requests
        // GET /players --------------------------------------------------------
        describe('/players', () => {
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
        describe('/players/:id', () => {
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
        describe('/players/squadNumber/:squadNumber', () => {
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
        it('Given POST, when request within rate limit, then request should be processed', async () => {
            // Arrange
            const body = playerStub.new;
            // Act
            const response = await request(app).post('/players').send(body);
            // Assert
            expect([201, 409]).toContain(response.status);
        });
        it('Given POST, when multiple requests exceed strict rate limit, then response status should be 429', async () => {
            // This test is skipped by default as it requires making 20+ requests
            // To enable, set RATE_LIMIT_MAX_STRICT to a lower value (e.g., 5) in test environment
            const maxRequests = Number.parseInt(process.env.RATE_LIMIT_MAX_STRICT || '20', 10);

            // Skip if using default or high limit
            if (maxRequests >= 20) {
                expect(true).toBe(true); // Skip test
                return;
            }

            // Act - Make POST requests up to the strict limit
            for (let i = 0; i < maxRequests; i++) {
                await request(app)
                    .post('/players')
                    .send(playerStub.new);
            }

            // Assert - The next POST request should be rate limited
            const response = await request(app).post('/players').send(playerStub.new);
            expect(response.status).toBe(429);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Too many write requests');
        }, 60000); // Increase timeout for multiple requests
        // POST /players -------------------------------------------------------
        describe('/players', () => {
            it('Given POST, when request body is empty, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const body: Record<string, any> = {};
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
            });
            it('Given POST, when firstName is missing, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const body = { id: 999, lastName: 'Doe', squadNumber: 10, position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'firstName')).toBe(true);
            });
            it('Given POST, when lastName is missing, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const body = { id: 999, firstName: 'John', squadNumber: 10, position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'lastName')).toBe(true);
            });
            it('Given POST, when squadNumber is missing, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const body = { id: 999, firstName: 'John', lastName: 'Doe', position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Given POST, when position is missing, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const body = { id: 999, firstName: 'John', lastName: 'Doe', squadNumber: 10 };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'position')).toBe(true);
            });
            it('Given POST, when squadNumber is out of range (>99), then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const body = { id: 999, firstName: 'John', lastName: 'Doe', squadNumber: 100, position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Given POST, when squadNumber is out of range (<1), then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const body = { id: 999, firstName: 'John', lastName: 'Doe', squadNumber: 0, position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
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
        beforeEach(async () => {
            await request(app).post(path).send(playerStub.new);
        });

        it('Given PUT, when request within rate limit, then response status should be 204 (No Content)', async () => {
            // Arrange
            const id = playerStub.new.id;
            const body = playerStub.new;
            // Act
            const response = await request(app).put(`/players/${id}`).send(body);
            // Assert
            expect(response.status).toBe(204);
        });
        // PUT /players/:id ----------------------------------------------------
        describe('/players/:id', () => {
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
                expect(response.body.errors).toBeDefined();
            });
            it('Given PUT, when firstName is missing, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body = { id, lastName: 'Doe', squadNumber: 10, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'firstName')).toBe(true);
            });
            it('Given PUT, when lastName is missing, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body = { id, firstName: 'John', squadNumber: 10, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'lastName')).toBe(true);
            });
            it('Given PUT, when squadNumber is missing, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body = { id, firstName: 'John', lastName: 'Doe', position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Given PUT, when position is missing, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body = { id, firstName: 'John', lastName: 'Doe', squadNumber: 10 };
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'position')).toBe(true);
            });
            it('Given PUT, when squadNumber is out of range (>99), then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body = { id, firstName: 'John', lastName: 'Doe', squadNumber: 100, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Given PUT, when squadNumber is out of range (<1), then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body = { id, firstName: 'John', lastName: 'Doe', squadNumber: 0, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Given PUT, when squadNumber is out of range, then response status should be 400 (Bad Request)', async () => {
                // Arrange
                const id = playerStub.new.id;
                const body = { id, firstName: 'John', lastName: 'Doe', squadNumber: 150, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/${id}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Given PUT, when request path is nonexistent ID, then response status should be 404 (Not Found)', async () => {
                // Arrange
                const id = 999;
                const body = { id: 999, firstName: 'John', lastName: 'Doe', squadNumber: 10, position: 'Forward' };
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
        beforeEach(async () => {
            await request(app).post(path).send(playerStub.new);
        });

        it('Given DELETE, when request within rate limit, then response status should be 404 (Not Found)', async () => {
            // Arrange
            const id = 999;
            // Act
            const response = await request(app).delete(`/players/${id}`);
            // Assert
            expect(response.status).toBe(404);
        });
        // DELETE /players/:id -------------------------------------------------
        describe('/players/:id', () => {
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
