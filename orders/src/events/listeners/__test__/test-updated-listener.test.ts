import {natsWrapper} from "../../../nats-wrapper";
import {TicketUpdatedEvent} from "@tktbch/common";
import {getMongoId} from "../../../test/order-helper";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";
import {TicketUpdatedListener} from "../ticket-updated-listener";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: getMongoId(),
        title: 'test',
        price: 20
    })
    await ticket.save();
    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'more cow bell',
        price: 85,
        userId: getMongoId()
    }
    // create fake msg obj
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {listener, data, ticket, msg};
}

describe('TicketUpdatedListener', () => {

    it('updates and saves a ticket', async () => {
        const {listener, data, msg, ticket} = await setup();
        // call the onMessage func with the data & msg
        await listener.onMessage(data, msg);
        // write assertions to make sure ticket was updated
        const updatedTicket = await Ticket.findById(data.id);
        expect(updatedTicket).toBeDefined();
        expect(updatedTicket!.title).toEqual(data.title)
    })

    it('acks the message', async () => {
        const {listener, data, msg} = await setup();
        // call the onMessage func with the data & msg
        await listener.onMessage(data, msg);
        // write assertions to make sure ticket was created
        const ticket = await Ticket.findById(data.id);
        expect(ticket).toBeDefined();
        expect(ticket!.title).toEqual(data.title)
        expect(msg.ack).toHaveBeenCalled()
    })

    it('should not ack the message if the version is out of order', async () => {
        const {listener, data, msg} = await setup();
        data.version = 3;
        try {
            await listener.onMessage(data, msg);
        } catch (e) {}
        // write assertions to make sure ticket was created
        expect(msg.ack).not.toHaveBeenCalled()
    })
})
