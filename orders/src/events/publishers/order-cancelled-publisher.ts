import {AbstractPublisher, Subjects, OrderCancelledEvent} from "@tktbch/common";


export class OrderCancelledPublisher extends AbstractPublisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
}
