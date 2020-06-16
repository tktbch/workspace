import request from 'supertest';
import { app } from '../../app';
import {Ticket} from "../../models/ticket";
import {getCookie} from "@tktbch/common";
import {natsWrapper} from "../../nats-wrapper";

const URL = '/api/tickets'
describe(URL, () => {

    it('should require user to be authorized', async () => {
        return request(app)
            .post(URL)
            .send({})
            .expect(401)
    })

    it('should create a ticket given a title and price', async () => {
        const cookie = getCookie();
        let tickets = await Ticket.find({});
        expect(tickets.length).toEqual(0);

        const resp = await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({
                title: 'test',
                price: 10.00
            })
            .expect(201)
        tickets = await Ticket.find({});
        expect(tickets.length).toEqual(1);
    })

    it('should require a title', async () => {
        const cookie = getCookie();
        return request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({})
            .expect(400)
    })

    it('should require a price', async () => {
        const cookie = getCookie();
        return request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({
                title: 'test'
            })
            .expect(400)
    })

    it('should require a price with a value', async () => {
        const cookie = getCookie();
        return request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({
                title: 'test',
                price: ''
            })
            .expect(400)
    })

    it('should publish a ticket:created event', async () => {
        const title = 'new ticket';

        await request(app)
            .post('/api/tickets')
            .set('Cookie', getCookie())
            .send({
                title,
                price: 20
            })
            .expect(201)

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })

})
