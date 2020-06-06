import {AbstractPublisher} from "./abstract-publisher";
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects";

export class TicketCreatedPublisher extends AbstractPublisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}
