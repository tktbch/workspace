import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketCreatedEvent} from "@tktbch/common";
import {getMongoId} from "../../../test/order-helper";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: getMongoId(),
        version: 0,
        title: 'test',
        price: 100,
        userId: getMongoId()
    }
    // create fake msg obj
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {listener, data, msg};
}

describe('TicketCreatedListener', () => {

    it('creates and saves a ticket', async () => {
        const {listener, data, msg} = await setup();
        // call the onMessage func with the data & msg
        await listener.onMessage(data, msg);
        // write assertions to make sure ticket was created
        const ticket = await Ticket.findById(data.id);
        expect(ticket).toBeDefined();
        expect(ticket!.title).toEqual(data.title)
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

})
