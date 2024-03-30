import request from 'supertest';
import app from '../src/app';

describe('Integration Tests', () => {
    describe('HTTP GET', () => {
        describe('/players', () => {
            it('When request has no parameters, then response status code should be 200 (OK)', async () => {
                const response = await request(app).get('/players');
                expect(response.status).toBe(200);
            });
            
            it('When request has invalid parameter, then response status code should be 404 (Not Found)', async () => {
                const response = await request(app).get('/players/invalid');
                expect(response.status).toBe(404);
            });
        });
        describe('/players/:squadNumber', () => {
            it('When request parameter identifies existing Player, then response status code should be 200 (OK)', async () => {
                const response = await request(app).get('/players/10');
                expect(response.status).toBe(200);
            });
        });
        it('When request parameter identifies existing Player, then response body should be the Player', async () => {
            const response = await request(app).get('/players/10');
            expect(response.body).toEqual({
                id: '10',
                firstName: 'Lionel',
                middleName: 'Andrés',
                lastName: 'Messi',
                dateOfBirth: '1987-06-24T00:00:00.000Z',
                squadNumber: 10,
                position: 'Right Winger',
                abbrPosition: 'RW',
                team: 'Inter Miami CF',
                league: 'Major League Soccer',
                starting11: true
            });
        });
        it('When request parameter does not identify existing Player, then response status code should be 404 (Not Found)', async () => {
            const response = await request(app).get('/players/42');
            expect(response.status).toBe(404);
        });
    });
});
