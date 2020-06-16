import mongoose from "mongoose";
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {OrderStatus} from "@tktbch/common";

export const getMongoId = () => {
    return new mongoose.Types.ObjectId().toHexString();
};

export const createTicket = async (title = 'test', price = 10) => {
    const id = getMongoId()
    const ticket = Ticket.build({ id, title, price });
    return await ticket.save();
};

export const createOrder = async (status = OrderStatus.Created, userId = getMongoId()) => {
    const ticket = await createTicket();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + (60 * 15))
    const otherOrder = Order.build({
        status,
        expiresAt,
        ticket,
        userId
    });
    return await otherOrder.save();
}
