import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@tktbch/common";
import {Message} from "node-nats-streaming";
import mongoose from "mongoose";
import {Subjects} from "@tktbch/common";

const getMongoId = () => new mongoose.Types.ObjectId().toHexString();

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        title: 'test',
        price: 100,
        userId: getMongoId()
    });
    await ticket.save();
    const data: OrderCreatedEvent['data'] = {
        id: getMongoId(),
        status: OrderStatus.Created,
        version: 0,
        expiresAt: new Date().toISOString(),
        userId: getMongoId(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg };
}

describe('OrderCreatedListener', () => {

    it('it reserves a ticket', async () => {
        const {listener, data, msg, ticket} = await setup();

        // call the onMessage func with the data & msg
        await listener.onMessage(data, msg);
        // write assertions to make sure ticket was created
        let updatedTicket = await Ticket.findById(ticket.id);
        // updatedTicket = await Ticket.findById(ticket.id);
        expect(updatedTicket!.orderId).toEqual(data.id)
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
        expect(eventData.orderId).toEqual(data.id);
        expect(eventType).toEqual(Subjects.TicketUpdated);
    })

})
