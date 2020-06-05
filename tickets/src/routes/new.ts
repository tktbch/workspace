import express, {Request, Response} from 'express';
import {requireAuth, validateRequest} from "@tktbitch/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";

const router = express.Router();

router.post('/api/tickets', requireAuth, [
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
    const userId = req.currentUser?.id;

    // @ts-ignore
    const ticket = Ticket.build({title, price, userId})
    await ticket.save();
    res.status(201).send(ticket);
})

export {router as createTicketRouter}
