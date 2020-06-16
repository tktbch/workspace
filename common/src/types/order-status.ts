export enum OrderStatus {
    // when the order has been created, but the ticket
    // it is trying to order has not been reserved.
    Created = 'created',

    // The ticket the order is trying to reserve has already been reserved
    // or the user cancelled the order.
    // The order expires before payment
    Cancelled = 'cancelled',

    // the order successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',

    // the order reserved the ticket and the user provided the payment successfully
    Completed = 'completed'
}
