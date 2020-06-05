import express, {Request, Response} from 'express';
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@tktbitch/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";

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

    ticket.title = title;
    ticket.price = price;

    await ticket.save()
    res.status(200).send(ticket);
})

export {router as updateTicketRouter}
