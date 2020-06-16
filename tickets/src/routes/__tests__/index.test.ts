import request from 'supertest';
import { app } from '../../app';
import {getCookie} from "@tktbch/common";

const createTicket = async (title: string, price: number) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', getCookie())
        .send({title, price})
}

describe('GET /api/tickets', () => {

    it('should return a list of tickets', async () => {
        await Promise.all([
            createTicket('t1', 10.00),
            createTicket('t2', 20.00),
            createTicket('t3', 15.00)
        ])

        const ticketResp = await request(app)
            .get(`/api/tickets`)
            .send()
            .expect(200)

        expect(ticketResp.body.length).toEqual(3);
    })

})
