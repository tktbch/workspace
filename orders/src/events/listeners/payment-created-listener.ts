import {AbstractListener, OrderStatus, PaymentCreatedEvent, Subjects} from "@tktbch/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";

export class PaymentCreatedListener extends AbstractListener<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found.');
        }

        order.set({orderStatus: OrderStatus.Completed});
        await order.save();
        msg.ack();
    }
}
