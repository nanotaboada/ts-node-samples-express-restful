import request from 'supertest';
import app from '../src/app.js';
import sequelize from '../src/database/sequelize.js';
import PlayerModel from '../src/models/player-model.js';
import playerStub from './player-stub.js';

const path = '/players';

/**
 * Helper function to check if an error exists for a specific field.
 */
const hasFieldError = (errors: any[], fieldName: string): boolean => {
    return errors.some((e: any) => e.path === fieldName);
};

describe('Integration Tests', () => {
    // Uses an in-memory SQLite DB (STORAGE_PATH=:memory: in .env.test) — the seeded
    // storage/players-sqlite3.db file on disk is never touched by the test suite.
    beforeAll(async () => {
        await sequelize.sync();
        await PlayerModel.bulkCreate(playerStub.all);
    });

    // Runs after every test in the suite (outer hook, fires after any inner afterEach).
    // Removes playerStub.nonexistent if it was left in the DB by a POST or DELETE beforeEach.
    // 404 is accepted: PUT tests never create it, and DELETE "existing" already removed it.
    afterEach(async () => {
        const response = await request(app).delete(`${path}/squadNumber/${playerStub.nonexistent.squadNumber}`);
        if (response.status !== 204 && response.status !== 404) {
            throw new Error(`Cleanup failed with status ${response.status}`);
        }
    });

    describe('GET', () => {
        (process.env.RATE_LIMIT_ENABLED === 'false' ? it.skip : it)('Request GET /players within rate limit → Response header rate limit standard', async () => {
            // Act
            const response = await request(app).get('/players');
            // Assert
            expect(response.headers).toHaveProperty('ratelimit-limit');
            expect(response.headers).toHaveProperty('ratelimit-remaining');
            expect(response.headers).toHaveProperty('ratelimit-reset');
        });
        it('Request GET /players within rate limit → Response header rate limit no legacy', async () => {
            // Act
            const response = await request(app).get('/players');
            // Assert
            expect(response.headers).not.toHaveProperty('x-ratelimit-limit');
            expect(response.headers).not.toHaveProperty('x-ratelimit-remaining');
        });
        ((Number.parseInt(process.env.RATE_LIMIT_MAX_GENERAL || '100', 10) > 50) ? it.skip : it)('Request GET /players exceed rate limit → Response status 429 Too Many Requests', async () => {
            // This test is skipped by default as it requires making 100+ requests
            // To enable, set RATE_LIMIT_MAX_GENERAL to a lower value (e.g., 10) in test environment
            const maxRequests = Number.parseInt(process.env.RATE_LIMIT_MAX_GENERAL || '100', 10);

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
            it('Request GET /players → Response status 200 OK', async () => {
                // Act
                const response = await request(app)
                    .get(path);
                // Assert
                expect(response.status).toBe(200);
            });
            it('Request GET /players → Response body players', async () => {
                // Act
                const response = await request(app)
                    .get(path);
                // Assert
                expect(response.body).toEqual(playerStub.all);
            });
        });
        // GET /players/:id ----------------------------------------------------
        describe('/players/:id', () => {
            it('Request GET /players/{id} unknown → Response status 404 Not Found', async () => {
                // Arrange
                const id = playerStub.unknown.id;
                // Act
                const response = await request(app)
                    .get(`${path}/${id}`);
                // Assert
                expect(response.status).toBe(404);
            });
            it('Request GET /players/{id} existing → Response status 200 OK', async () => {
                // Arrange
                const { id } = playerStub.findBySquadNumber(10);
                // Act
                const response = await request(app)
                    .get(`${path}/${id}`);
                // Assert
                expect(response.status).toBe(200);
            });
            it('Request GET /players/{id} existing → Response body player match', async () => {
                // Arrange
                const expected = playerStub.findBySquadNumber(10);
                // Act
                const response = await request(app)
                    .get(`${path}/${expected.id}`);
                // Assert
                expect(response.body).toEqual(expected);
            });
        });
        // GET /players/squadNumber/:squadNumber -------------------------------
        describe('/players/squadNumber/:squadNumber', () => {
            it('Request GET /players/squadNumber/{squadNumber} unknown → Response status 404 Not Found', async () => {
                // Arrange
                const squadNumber = 999;
                // Act
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                // Assert
                expect(response.status).toBe(404);
            });
            it('Request GET /players/squadNumber/{squadNumber} existing → Response status 200 OK', async () => {
                // Arrange
                const squadNumber = 10;
                // Act
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                // Assert
                expect(response.status).toBe(200);
            });
            it('Request GET /players/squadNumber/{squadNumber} existing → Response body player match', async () => {
                // Arrange
                const squadNumber = 10;
                const expected = playerStub.findBySquadNumber(squadNumber);
                // Act
                const response = await request(app)
                    .get(`${path}/squadNumber/${squadNumber}`);
                // Assert
                expect(response.body).toEqual(expected);
            });
        });
    });
    describe('POST', () => {
        it('Request POST /players within rate limit → Response status 201 Created', async () => {
            // Arrange
            const body = playerStub.nonexistent;
            // Act
            const response = await request(app).post('/players').send(body);
            // Assert
            expect(response.status).toBe(201);
        });
        ((Number.parseInt(process.env.RATE_LIMIT_MAX_STRICT || '20', 10) >= 20) ? it.skip : it)('Request POST /players exceed rate limit → Response status 429 Too Many Requests', async () => {
            // This test is skipped by default as it requires making 20+ requests
            // To enable, set RATE_LIMIT_MAX_STRICT to a lower value (e.g., 5) in test environment
            const maxRequests = Number.parseInt(process.env.RATE_LIMIT_MAX_STRICT || '20', 10);

            // Act - Make POST requests up to the strict limit
            for (let i = 0; i < maxRequests; i++) {
                await request(app)
                    .post('/players')
                    .send(playerStub.nonexistent);
            }

            // Assert - The next POST request should be rate limited
            const response = await request(app).post('/players').send(playerStub.nonexistent);
            expect(response.status).toBe(429);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Too many write requests');
        }, 60000); // Increase timeout for multiple requests
        // POST /players -------------------------------------------------------
        describe('/players', () => {
            it('Request POST /players body empty → Response status 400 Bad Request', async () => {
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
            it('Request POST /players firstName missing → Response status 400 Bad Request', async () => {
                // Arrange
                const body = { lastName: 'Doe', squadNumber: 10, position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'firstName')).toBe(true);
            });
            it('Request POST /players lastName missing → Response status 400 Bad Request', async () => {
                // Arrange
                const body = { firstName: 'John', squadNumber: 10, position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'lastName')).toBe(true);
            });
            it('Request POST /players squadNumber missing → Response status 400 Bad Request', async () => {
                // Arrange
                const body = { firstName: 'John', lastName: 'Doe', position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Request POST /players position missing → Response status 400 Bad Request', async () => {
                // Arrange
                const body = { firstName: 'John', lastName: 'Doe', squadNumber: 10 };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'position')).toBe(true);
            });
            it('Request POST /players squadNumber >99 → Response status 400 Bad Request', async () => {
                // Arrange
                const body = { firstName: 'John', lastName: 'Doe', squadNumber: 100, position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Request POST /players squadNumber <1 → Response status 400 Bad Request', async () => {
                // Arrange
                const body = { firstName: 'John', lastName: 'Doe', squadNumber: 0, position: 'Forward' };
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Request POST /players body existing → Response status 409 Conflict', async () => {
                // Arrange
                const body = playerStub.existing;
                // Act
                const response = await request(app)
                    .post(path)
                    .send(body);
                // Assert
                expect(response.status).toBe(409);
            });
            it('Request POST /players body nonexistent → Response status 201 Created', async () => {
                // Arrange
                const body = playerStub.nonexistent;
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
        // Runs after every PUT test (inner hook, fires before the top-level afterEach).
        // Restores playerStub.existing to its original seeded values so later tests
        // see a consistent DB state regardless of what each PUT test wrote.
        afterEach(async () => {
            const response = await request(app)
                .put(`${path}/squadNumber/${playerStub.existing.squadNumber}`)
                .send(playerStub.findBySquadNumber(playerStub.existing.squadNumber));
            if (response.status !== 204) {
                throw new Error(`Restore failed with status ${response.status}`);
            }
        });

        it('Request PUT /players/squadNumber/{squadNumber} within rate limit → Response status 204 No Content', async () => {
            // Arrange
            const squadNumber = playerStub.existing.squadNumber;
            const body = playerStub.existing;
            // Act
            const response = await request(app).put(`/players/squadNumber/${squadNumber}`).send(body);
            // Assert
            expect(response.status).toBe(204);
        });
        ((Number.parseInt(process.env.RATE_LIMIT_MAX_STRICT || '20', 10) >= 20) ? it.skip : it)('Request PUT /players/squadNumber/{squadNumber} exceed rate limit → Response status 429 Too Many Requests', async () => {
            // This test is skipped by default as it requires making 20+ requests
            // To enable, set RATE_LIMIT_MAX_STRICT to a lower value (e.g., 5) in test environment
            const maxRequests = Number.parseInt(process.env.RATE_LIMIT_MAX_STRICT || '20', 10);

            // Act - Make PUT requests up to the strict limit
            for (let i = 0; i < maxRequests; i++) {
                await request(app)
                    .put(`/players/squadNumber/${playerStub.existing.squadNumber}`)
                    .send(playerStub.existing);
            }

            // Assert - The next PUT request should be rate limited
            const response = await request(app)
                .put(`/players/squadNumber/${playerStub.existing.squadNumber}`)
                .send(playerStub.existing);
            expect(response.status).toBe(429);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Too many write requests');
        }, 60000); // Increase timeout for multiple requests
        // PUT /players/squadNumber/:squadNumber --------------------------------
        describe('/players/squadNumber/:squadNumber', () => {
            it('Request PUT /players/squadNumber/{squadNumber} body empty → Response status 400 Bad Request', async () => {
                // Arrange
                const squadNumber = playerStub.existing.squadNumber;
                const body: Record<string, any> = {};
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
            });
            it('Request PUT /players/squadNumber/{squadNumber} firstName missing → Response status 400 Bad Request', async () => {
                // Arrange
                const squadNumber = playerStub.existing.squadNumber;
                const body = { lastName: 'Doe', squadNumber, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'firstName')).toBe(true);
            });
            it('Request PUT /players/squadNumber/{squadNumber} lastName missing → Response status 400 Bad Request', async () => {
                // Arrange
                const squadNumber = playerStub.existing.squadNumber;
                const body = { firstName: 'John', squadNumber, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'lastName')).toBe(true);
            });
            it('Request PUT /players/squadNumber/{squadNumber} squadNumber missing → Response status 400 Bad Request', async () => {
                // Arrange
                const squadNumber = playerStub.existing.squadNumber;
                const body = { firstName: 'John', lastName: 'Doe', position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Request PUT /players/squadNumber/{squadNumber} position missing → Response status 400 Bad Request', async () => {
                // Arrange
                const squadNumber = playerStub.existing.squadNumber;
                const body = { firstName: 'John', lastName: 'Doe', squadNumber };
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'position')).toBe(true);
            });
            it('Request PUT /players/squadNumber/{squadNumber} squadNumber >99 → Response status 400 Bad Request', async () => {
                // Arrange
                const squadNumber = playerStub.existing.squadNumber;
                const body = { firstName: 'John', lastName: 'Doe', squadNumber: 100, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Request PUT /players/squadNumber/{squadNumber} squadNumber <1 → Response status 400 Bad Request', async () => {
                // Arrange
                const squadNumber = playerStub.existing.squadNumber;
                const body = { firstName: 'John', lastName: 'Doe', squadNumber: 0, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(hasFieldError(response.body.errors, 'squadNumber')).toBe(true);
            });
            it('Request PUT /players/squadNumber/{squadNumber} unknown → Response status 404 Not Found', async () => {
                // Arrange
                const squadNumber = playerStub.unknown.squadNumber; // valid range (1–99) but not in DB
                const body = { firstName: 'John', lastName: 'Doe', squadNumber, position: 'Forward' };
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(404);
            });
            it('Request PUT /players/squadNumber/{squadNumber} existing → Response status 204 No Content', async () => {
                // Arrange
                const squadNumber = playerStub.existing.squadNumber;
                const body = playerStub.existing;
                // Act
                const response = await request(app)
                    .put(`${path}/squadNumber/${squadNumber}`)
                    .send(body);
                // Assert
                expect(response.status).toBe(204);
            });
        });
    });
    describe('DELETE', () => {
        // Seeds playerStub.nonexistent before each DELETE test so there is always
        // a known player to target. The top-level afterEach handles removal in case
        // a test does not consume it (e.g. the "nonexistent squadNumber" 404 test).
        beforeEach(async () => {
            await request(app).post(path).send(playerStub.nonexistent);
        });

        // DELETE /players/squadNumber/:squadNumber ----------------------------
        describe('/players/squadNumber/:squadNumber', () => {
            it('Request DELETE /players/squadNumber/{squadNumber} unknown → Response status 404 Not Found', async () => {
                // Arrange
                const squadNumber = playerStub.unknown.squadNumber; // valid range (1–99) but not in DB
                // Act
                const response = await request(app)
                    .delete(`${path}/squadNumber/${squadNumber}`)
                // Assert
                expect(response.status).toBe(404);
            });
            it('Request DELETE /players/squadNumber/{squadNumber} existing → Response status 204 No Content', async () => {
                // Arrange
                const squadNumber = playerStub.nonexistent.squadNumber; // posted in beforeEach
                // Act
                const response = await request(app)
                    .delete(`${path}/squadNumber/${squadNumber}`)
                // Assert
                expect(response.status).toBe(204);
            });
        });
    });
});
