import request from 'supertest';
import {app} from '../../app';
import {getCookie, OrderStatus} from "@tktbch/common";
import {createOrder, getMongoId} from "../../test/order-helper";
import {Order} from "../../models/order";
import {natsWrapper} from "../../nats-wrapper";

describe('PUT /api/orders/:id', () => {

    it('should require the user to be authenticated', async () => {
        const orderId = getMongoId();
        const resp = await request(app)
            .put(`/api/orders/${orderId}`)
            .send()
            .expect(401)
    })

    it('should return a 401 if the user doesn\'t own the order', async () => {
        const userOne = getMongoId();
        const userTwo = getMongoId();
        const cookie = getCookie({id: userOne, email: 'userone@test.com'});
        const order = await createOrder(OrderStatus.Created, userTwo)
        const resp = await request(app)
            .put(`/api/orders/${order.id}`)
            .set('Cookie', cookie)
            .send()
            .expect(401)
    })

    it('should return a 404 if the order isn\'t found', async () => {
        const orderId = getMongoId();
        const resp = await request(app)
            .put(`/api/orders/${orderId}`)
            .set('Cookie', getCookie())
            .send()
            .expect(404)
    })

    it('should return a 200 if the order is successfully cancelled', async () => {
        const user = getMongoId();
        const cookie = getCookie({id: user, email: 'user@test.com'});
        const order = await createOrder(OrderStatus.Created, user)
        await request(app)
            .put(`/api/orders/${order.id}`)
            .set('Cookie', cookie)
            .send()
            .expect(200)
        const updatedOrder = await Order.findById(order.id)
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    })

    it('should publish an order:cancelled event when successfully cancelled', async () => {
        const user = getMongoId();
        const cookie = getCookie({id: user, email: 'user@test.com'});
        const order = await createOrder(OrderStatus.Created, user)
        await request(app)
            .put(`/api/orders/${order.id}`)
            .set('Cookie', cookie)
            .send()
            .expect(200)
        const updatedOrder = await Order.findById(order.id)
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })

})
