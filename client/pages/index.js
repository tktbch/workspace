import React from 'react';
import Link from "next/link";

const LandingPage = ({ tickets, title }) => {

    const ticketList = tickets.map(t => (
        <tr key={t.id}>
            <td><Link href="/tickets/[ticketId]" as={`/tickets/${t.id}`}><a>{t.title}</a></Link></td>
            <td>{t.price}</td>
        </tr>
    ));

    return (
        <div>
            <h1>{title}</h1>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                </tr>
                </thead>
                <tbody>
                { ticketList }
                </tbody>
            </table>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/tickets');
    return {
        title: 'Tckts',
        tickets: data
    };
}

export default LandingPage;
