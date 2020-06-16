import {ExpirationCompleteListener} from "../expiration-complete-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {getMongoId} from "../../../test/order-helper";
import {Order} from "../../../models/order";
import {ExpirationCompleteEvent, OrderStatus, Subjects} from "@tktbch/common";
import {Message} from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: getMongoId(),
        price: 50,
        title: 'test'
    })
    await ticket.save();

    const order = Order.build({
        userId: getMongoId(),
        expiresAt: new Date(),
        status: OrderStatus.Created,
        ticket
    })
    await order.save();

    const data:ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, order, data, msg};
}

describe('ExpirationCompleteListener', () => {
    it('should update the order status to cancelled', async () => {
        const {listener, order, msg, data} = await setup();
        await listener.onMessage(data, msg);
        const updatedOrder = await Order.findById(data.orderId);
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    })

    it('should emit an OrderCancelled event', async () => {
        const {listener, order, msg, data} = await setup();
        await listener.onMessage(data, msg);
        expect(natsWrapper.client.publish).toHaveBeenCalled();

        const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
        const eventType = (natsWrapper.client.publish as jest.Mock).mock.calls[0][0];
        expect(eventType).toEqual(Subjects.OrderCancelled);
        expect(eventData.id).toEqual(data.orderId);
    })

    it('should ack the message', async () => {
        const {listener, order, msg, data} = await setup();
        await listener.onMessage(data, msg);
        expect(msg.ack).toHaveBeenCalled();
    })
})


