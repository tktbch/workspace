import {AbstractPublisher, Subjects, OrderCreatedEvent} from "@tktbch/common";


export class OrderCreatedPublisher extends AbstractPublisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
}
