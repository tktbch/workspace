import request from 'supertest';
import {app} from "../../app";

const signinUrl = '/api/users/signin';
describe("signin", () => {

    beforeEach(() => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'test'
            })
    })

    it('should return a 200 successful signin', async () => {
        return request(app)
            .post(signinUrl)
            .send({
                email: 'test@test.com',
                password: 'test'
            })
            .expect(200);
    })

    it('should set a jwt cookie on successful signin', async () => {
        const resp = await request(app)
            .post(signinUrl)
            .send({
                email: 'test@test.com',
                password: 'test'
            })
            .expect(200);
        expect(resp.get('Set-Cookie')).toBeDefined()
    })

    it('should return a 400 if passwords dont match', async () => {
        return request(app)
            .post(signinUrl)
            .send({
                email: 'test@test.com',
                password: 'test1'
            })
            .expect(400);
    })

    it('should return a 400 if user is not found', async () => {
        return request(app)
            .post(signinUrl)
            .send({
                email: 'test1@test.com',
                password: 'test'
            })
            .expect(400);
    })

    it('should return a 400 with a missing email or password', async () => {
        await request(app)
            .post(signinUrl)
            .send({
                password: '123456789'
            })
            .expect(400);

        await request(app)
            .post(signinUrl)
            .send({
                email: 'test@test.com'
            })
            .expect(400);
    })
});
