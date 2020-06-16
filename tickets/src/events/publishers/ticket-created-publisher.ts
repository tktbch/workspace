import {AbstractPublisher, Subjects, TicketCreatedEvent} from "@tktbch/common";


export class TicketCreatedPublisher extends AbstractPublisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}
