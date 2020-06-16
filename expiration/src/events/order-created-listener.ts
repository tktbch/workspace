import {AbstractListener, OrderCreatedEvent, Subjects} from "@tktbch/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {expirationQueue} from "../queues/expiration-queue";

export class OrderCreatedListener extends AbstractListener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`waiting ${delay}ms to process expiration`)
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        })
        msg.ack();
    }
}
