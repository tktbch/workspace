import {AbstractPublisher, ExpirationCompleteEvent, Subjects} from "@tktbch/common";

export class ExpirationCompletePublisher extends AbstractPublisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
