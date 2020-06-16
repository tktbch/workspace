import {AbstractPublisher, Subjects, TicketUpdatedEvent} from "@tktbch/common";


export class TicketUpatedPublisher extends AbstractPublisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}
