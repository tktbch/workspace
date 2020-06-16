import React from 'react';
import Link from "next/link"

export const OrderIndex = ({orders}) => {

    const orderList = orders.map(o => (
        <tr key={o.id}>
            <td><Link href="/orders/[orderId]" as={`/orders/${o.id}`}><a>{o.ticket.title}</a></Link></td>
            <td>{o.ticket.price}</td>
            <td>{o.status}</td>
        </tr>
    ));

    return (
        <div>
            <h1>Orders</h1>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Status</th>
                </tr>
                </thead>
                <tbody>
                { orderList }
                </tbody>
            </table>
        </div>
    )
}

OrderIndex.getInitialProps = async (context, client) => {
    const {data: orders} = await client.get('/api/orders');

    return { orders };
}

export default OrderIndex;
