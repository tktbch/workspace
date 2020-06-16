import request from 'supertest';
import mongoose from "mongoose";
import { app } from '../../app';
import {getCookie} from "@tktbch/common";
import {natsWrapper} from "../../nats-wrapper";
import {Ticket} from "../../models/ticket";

const createTicket = async (title: string, price: number) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', getCookie())
        .send({title, price})
}

describe('PUT /api/tickets/:id', () => {

    it('should return a 404 if the id does not exist', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        return request(app)
            .put(`/api/tickets/${id}`)
            .set('Cookie', getCookie())
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
            .set('Cookie', getCookie({ id, email: 'test2@test.com'}))
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
            .set('Cookie', getCookie())
            .send({})
            .expect(400)
    })

    it('should return a 200 if a user provides valid input', async () => {
        const resp = await createTicket('t1', 10);
        const updateResponse =  await request(app)
            .put(`/api/tickets/${resp.body.id}`)
            .set('Cookie', getCookie())
            .send({
                title: 't2',
                price: 20
            })
            .expect(200)
        expect(updateResponse.body.title).toEqual('t2');
        expect(updateResponse.body.price).toEqual(20);
    })

    it('should publish a ticket:updated event', async () => {
        const ticket = await createTicket('shiznit', 50);

        await request(app)
            .put(`/api/tickets/${ticket.body.id}`)
            .set('Cookie', getCookie())
            .send({
                title: 'Tha Shiznit',
                price: 100
            })
            .expect(200)

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })

    it('should reject updates if ticket is reserved', async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();
        const orderId = new mongoose.Types.ObjectId().toHexString();
        const ticket = Ticket.build({
            userId,
            title: 'Tha Shiznit',
            price: 50
        });
        ticket.set({orderId});
        await ticket.save();
        await request(app)
            .put(`/api/tickets/${ticket.id}`)
            .set('Cookie', getCookie({id: userId, email: 'test@test.com'}))
            .send({
                title: 'Tha Shiznit',
                price: 100
            })
            .expect(400)
    })
})
