import request from 'supertest';
import {app} from "../../app";
import {getCookie} from "@tktbch/common";

const URL = '/api/users/currentuser';

describe(URL, () => {

    it('should respond with the current user if logged in', async () => {
        const cookie = getCookie();
        const resp = await request(app)
            .get(URL)
            .set('Cookie', cookie)
            .send({})
            .expect(200)
        expect(resp.body.currentUser.email).toBe('test@test.com');

    })

    it('should set current user to null if logged out', async () => {
        const resp = await request(app)
            .get(URL)
            .send({})
            .expect(200)
        expect(resp.body.currentUser).toBeNull();
    })
});
