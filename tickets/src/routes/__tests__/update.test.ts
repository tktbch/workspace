import request from 'supertest';
import mongoose from "mongoose";
import { app } from '../../app';
import {AuthHelper} from "@tktbitch/common";

const createTicket = async (title: string, price: number) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', AuthHelper.signin())
        .send({title, price})
}

describe('PUT /api/tickets/:id', () => {

    it('should return a 404 if the id does not exist', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        return request(app)
            .put(`/api/tickets/${id}`)
            .set('Cookie', AuthHelper.signin())
            .send({
                title: 'test',
                price: 20
            })
            .expect(404)
    })

    it('should return a 401 if a user is not authenticated', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        return request(app)
            .put(`/api/tickets/${id}`)
            .send({
                title: 'test',
                price: 20
            })
            .expect(401)
    })

    it('should return a 401 if a user tries to edit someone else\'s ticket', async () => {
        const resp = await createTicket('t1', 10);
        const id = new mongoose.Types.ObjectId().toHexString();

        return request(app)
            .put(`/api/tickets/${resp.body.id}`)
            .set('Cookie', AuthHelper.signin({ id, email: 'test2@test.com'}))
            .send({
                title: 'test2',
                price: 205
            })
            .expect(401)
    })

    it('should return a 400 if a user provides invalid title or price', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        return request(app)
            .put(`/api/tickets/${id}`)
            .set('Cookie', AuthHelper.signin())
            .send({})
            .expect(400)
    })

    it('should return a 200 if a user provides valid input', async () => {
        const resp = await createTicket('t1', 10);
        const updateResponse =  await request(app)
            .put(`/api/tickets/${resp.body.id}`)
            .set('Cookie', AuthHelper.signin())
            .send({
                title: 't2',
                price: 20
            })
            .expect(200)
        expect(updateResponse.body.title).toEqual('t2');
        expect(updateResponse.body.price).toEqual(20);
    })
})
