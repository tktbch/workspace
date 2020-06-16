
import {Message} from "node-nats-streaming";
import {AbstractListener, Subjects, TicketCreatedEvent} from "@tktbch/common";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketCreatedListener extends AbstractListener<TicketCreatedEvent> {

    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const {id, title, price} = data;
        const ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();

        msg.ack();
    }

}
