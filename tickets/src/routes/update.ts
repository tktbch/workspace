import express, {Request, Response} from 'express';
import {BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@tktbch/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {natsWrapper} from "../nats-wrapper";
import {TicketUpatedPublisher} from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title')
        .notEmpty()
        .withMessage('Title is required'),
    body('title')
        .isString()
        .withMessage('Title should be a string'),
    body('price')
        .isFloat({gt: 0})
        .withMessage('Price must be greater than zero')
], validateRequest, async (req: Request, res: Response) => {
    const {title, price} = req.body;
    const id = req.params.id;
    const userId = req.currentUser?.id;

    // @ts-ignore
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError('Unauthorized');
    }

    if (ticket.orderId) {
        throw new BadRequestError('Ticket is reserved.')
    }

    ticket.title = title;
    ticket.price = price;

    try {
        await ticket.save()
        await new TicketUpatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })
    } catch (e) {
        throw new Error(e)
    }
    res.status(200).send(ticket);
})

export {router as updateTicketRouter}
