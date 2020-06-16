import express, {Request, Response} from 'express';
import {Order, OrderStatus} from "../models/order";
import {NotAuthorizedError, NotFoundError, requireAuth} from "@tktbch/common";
import {natsWrapper} from "../nats-wrapper";
import {OrderCancelledPublisher} from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

router.put('/api/orders/:orderId', requireAuth, async (req:Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError('Unauthorized');
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })
    res.send(order);
})

export {router as cancelOrderRouter}
