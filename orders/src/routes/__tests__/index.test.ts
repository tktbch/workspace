import request from 'supertest';
import {app} from '../../app';
import {getCookie, OrderStatus} from "@tktbch/common";
import {createOrder, getMongoId} from "../../test/order-helper";

describe('GET /api/orders', () => {

    it('should require the user to be authenticated', async () => {

        const resp = await request(app)
            .get('/api/orders')
            .send()
            .expect(401)
    })

    it('should return the users orders', async () => {
        const userOne = getMongoId();
        const cookie = getCookie({id: userOne, email: 'userone@test.com'});
        await createOrder(OrderStatus.Completed, userOne);
        await createOrder(OrderStatus.AwaitingPayment, userOne);
        await createOrder(OrderStatus.Cancelled, userOne);
        const resp = await request(app)
            .get('/api/orders')
            .set('Cookie', cookie)
            .send()
            .expect(200)
        expect(resp.body.length).toEqual(3);
    })

    it('should only return the current users orders', async () => {
        const userOne = getMongoId();
        const userTwo = getMongoId();
        const cookie = getCookie({id: userOne, email: 'userone@test.com'});
        await createOrder(OrderStatus.Completed, userOne);
        await createOrder(OrderStatus.Completed, userTwo);
        const {body: orders} = await request(app)
            .get('/api/orders')
            .set('Cookie', cookie)
            .send()
            .expect(200)
        expect(orders.length).toEqual(1)
    })

})
