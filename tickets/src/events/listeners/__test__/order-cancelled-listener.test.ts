import {OrderCancelledListener} from "../order-cancelled-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCancelledEvent, OrderStatus, Subjects} from "@tktbch/common";
import {Message} from "node-nats-streaming";
import mongoose from "mongoose";

const getMongoId = () => new mongoose.Types.ObjectId().toHexString();

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = getMongoId();
    const ticket = Ticket.build({
        title: 'test',
        price: 100,
        userId: getMongoId()
    });
    ticket.set({ orderId })
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: ticket.version,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg };
}

describe('OrderCancelledListener', () => {

    it('it removes a ticket reservation', async () => {
        const {listener, data, msg, ticket} = await setup();

        // call the onMessage func with the data & msg
        await listener.onMessage(data, msg);
        // write assertions to make sure ticket was created
        let updatedTicket = await Ticket.findById(ticket.id);
        // updatedTicket = await Ticket.findById(ticket.id);
        expect(updatedTicket!.orderId).toBeUndefined();
    })

    it('acks the message', async () => {
        const {listener, data, msg} = await setup();
        // call the onMessage func with the data & msg
        await listener.onMessage(data, msg);
        // write assertions to make sure ticket was created
        expect(msg.ack).toHaveBeenCalled()
    })

    it('should publish a ticket updated event', async () => {
        const {listener, data, msg} = await setup();
        // call the onMessage func with the data & msg
        await listener.onMessage(data, msg);
        // write assertions to make sure ticket was created
        expect(natsWrapper.client.publish).toHaveBeenCalled();
        const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
        const eventType = (natsWrapper.client.publish as jest.Mock).mock.calls[0][0];
        expect(eventData.orderId).toBeUndefined()
        expect(eventType).toEqual(Subjects.TicketUpdated);
    })

})
