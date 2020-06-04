import request from 'supertest';
import {app} from "../../app";
import {AuthHelper} from "../../test/auth-helper";

const signoutUrl = '/api/users/signout';
describe("signout", () => {
    let cookie: string;

    beforeEach(async () => {
        cookie = await AuthHelper.signup()
    })

    it('should return a 200 successful signout', async () => {
        return request(app)
            .post(signoutUrl)
            .send({})
            .expect(200);
    })

    it('should remove the jwt cookie on signout', async () => {
        const resp = await request(app)
            .post(signoutUrl)
            .send({})
            .expect(200);
        expect(resp.get('Set-Cookie')[0]).toContain('express:sess=;')
    })
});
