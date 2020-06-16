import express, {Request, Response} from 'express';
import {Order} from "../models/order";
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from "@tktbch/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {natsWrapper} from "../nats-wrapper";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .isMongoId()
        .withMessage('ticketId is required')
], validateRequest, async (req:Request, res: Response) => {
    // Get the userId
    const userId = req.currentUser!.id
    // Find the ticket
    const ticket  = await Ticket.findById(req.body.ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }
    // check if the ticket is reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError('Ticket already reserved.')
    }
    // calc expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // build the order
    const order = Order.build({
        ticket,
        userId,
        expiresAt,
        status: OrderStatus.Created
    })
    await order.save();
    // publish order:created event
    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        status: order.status,
        version: order.version,
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price
        }
    })
    res.status(201).send(order)
})

export {router as createOrderRouter}
