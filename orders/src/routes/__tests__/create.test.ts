import request from 'supertest';
import {app} from '../../app';
import {getCookie, OrderStatus} from "@tktbch/common";
import {createOrder, createTicket, getMongoId} from "../../test/order-helper";
import {natsWrapper} from "../../nats-wrapper";

describe('POST /api/orders', () => {

    it('should return a 404 if a ticket does not exist', async () => {
        const ticketId = getMongoId();
        return request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({
                ticketId
            })
            .expect(404)
    })

    it('should return a 400 a valid mongoid is not supplied', async () => {
        const ticketId = '123';
        return request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({
                ticketId
            })
            .expect(400)
    })

    it('should return a 400 if a ticket is already reserved', async () => {
        const otherOrder = await createOrder(OrderStatus.AwaitingPayment);

        return request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({
                ticketId: otherOrder.ticket.id
            })
            .expect(400)
    })

    it('should return a 201 when it successfully reserves a ticket', async () => {
        const ticket = await createTicket();

        return request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({
                ticketId: ticket.id
            })
            .expect(201)
    })


    it('should publish an order:created event when it successfully reserves a ticket', async () => {
        const ticket = await createTicket();

        await request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({
                ticketId: ticket.id
            })
            .expect(201)
        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })

})
