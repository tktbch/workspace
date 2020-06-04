import request from "supertest";
import {app} from "../app";

export class AuthHelper {

    static  signup = async (email = 'test@test.com', password = 'test') => {
        const resp = await request(app)
            .post('/api/users/signup')
            .send({ email, password })
        return resp.get('Set-Cookie')[0];
    }

}
