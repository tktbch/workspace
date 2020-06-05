import request from "supertest";
import { app } from '../../app';
import {AuthHelper} from "@tktbitch/common";
import mongoose from "mongoose";

describe('GET /api/tickets/:id', () => {

    it('returns a 404 if the ticket is not found', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
            .get(`/api/tickets/${id}`)
            .send()
            .expect(404)
    })

    it('returns a ticket if it is found', async () => {
        const title = 'test';
        const price = 10.00;
        const resp = await request(app)
            .post('/api/tickets')
            .set('Cookie', AuthHelper.signin())
            .send({title, price})
        const ticketResp = await request(app)
            .get(`/api/tickets/${resp.body.id}`)
            .send()
            .expect(200)

        expect(ticketResp.body.title).toEqual(title);
        expect(ticketResp.body.price).toEqual(price);
    })

})
