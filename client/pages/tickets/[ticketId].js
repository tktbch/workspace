import React from 'react';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ticket}) => {

    const handleSuccess = async (order) => {
        await Router.push('/orders/[orderId]', `/orders/${order.id}`);
    }

    const {doRequest, errors} = useRequest({
        url: '/api/orders',
        method: 'post',
        body: { ticketId: ticket.id },
        onSuccess: handleSuccess
    });

    const handlePurchaseClick = () => {
        doRequest();
    }

    return (
        <div>
            <h1>{ticket.title}</h1>
            <dl className="row">
                <dt>Price</dt>
                <dd>${ticket.price.toFixed(2)}</dd>
            </dl>
            { errors }
            <button className="btn btn-primary" onClick={handlePurchaseClick}>Get It</button>
        </div>
    )
}

TicketShow.getInitialProps = async (ctx, client) => {
    const { ticketId } = ctx.query;
    const { data: ticket } = await client.get(`/api/tickets/${ticketId}`);
    return {
        ticket
    }
}
export default TicketShow;
