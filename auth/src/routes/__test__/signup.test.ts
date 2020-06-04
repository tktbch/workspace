import request from 'supertest';
import {app} from "../../app";

describe("signup", () => {
    it('should return a 201 successful signup', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'test'
            })
            .expect(201);
    })

    it('should return a 400 without a valid email', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test',
                password: 'test'
            })
            .expect(400);
    })

    it('should return a 400 with a password less than 4 chars', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'tes'
            })
            .expect(400);
    })

    it('should return a 400 with a password more than 20 chars', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: '1111111111111111111111'
            })
            .expect(400);
    })

    it('should return a 400 with a missing email or password', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                password: '123456789'
            })
            .expect(400);

        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com'
            })
            .expect(400);
    })

    it('should return a 400 if a user already exists', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: '123456789'
            })
            .expect(201);

        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: '123456789'
            })
            .expect(400);
    })

    it('should set a jwt cookie on successful signup', async () => {
        const resp = await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: '123456789'
            })
            .expect(201);
        expect(resp.get('Set-Cookie')).toBeDefined()
    })
})
