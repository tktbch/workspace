import request from 'supertest';
import {app} from '../../app';
import {getCookie, OrderStatus} from "@tktbch/common";
import {createOrder, getMongoId} from "../../test/order-helper";
import {Order} from "../../models/order";

describe('GET /api/orders/:id', () => {

    it('should require the user to be authenticated', async () => {
        const orderId = getMongoId();
        const resp = await request(app)
            .get(`/api/orders/${orderId}`)
            .send()
            .expect(401)
    })

    it('should return a 401 if the user doesn\'t own the order', async () => {
        const userOne = getMongoId();
        const userTwo = getMongoId();
        const cookie = getCookie({id: userOne, email: 'userone@test.com'});
        const order = await createOrder(OrderStatus.Created, userTwo)
        const resp = await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie', cookie)
            .send()
            .expect(401)
    })

    it('should return a 404 if the order isn\'t found', async () => {
        const orderId = getMongoId();
        const resp = await request(app)
            .get(`/api/orders/${orderId}`)
            .set('Cookie', getCookie())
            .send()
            .expect(404)
    })

    it('should return a 200 if the order is found', async () => {
        const user = getMongoId();
        const cookie = getCookie({id: user, email: 'user@test.com'});
        const order = await createOrder(OrderStatus.Created, user)
        const resp = await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie', cookie)
            .send()
            .expect(200)
        expect(resp.body.id).toEqual(order.id)
    })

    it('should populate the ticket associated with the order', async () => {
        const user = getMongoId();
        const cookie = getCookie({id: user, email: 'user@test.com'});
        const order = await createOrder(OrderStatus.Created, user)
        const {body: fetchedOrder} = await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie', cookie)
            .send()
            .expect(200)
        expect(fetchedOrder.id).toEqual(order.id)
        expect(fetchedOrder.ticket.id).toBeDefined();
    })

})
