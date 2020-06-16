import {AbstractListener, OrderCreatedEvent, Subjects} from "@tktbch/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends AbstractListener<OrderCreatedEvent>{

    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({ orderId: data.id });
        await ticket.save();
        await new TicketUpatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            orderId: ticket.orderId,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId
        })
        msg.ack();
    }

}
