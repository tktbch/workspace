import React, {useState, useEffect} from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {
    const StripeKey = 'pk_test_51Gt31nEwyNpMKOLFg81TF3DHDqk90fwzIhjmGcG9tEzpOctDPdkHZy9FWwerqjIISawW1DLNzvHFYO2fSNRMRyn500kp6evQt5';
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const handlePurchase = async ({id}) => {
        await doRequest({token: id});
        await Router.push('/orders')
    }

    const handlePaymentSuccess = (payment) => {
        console.log(payment);
    }

    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: handlePaymentSuccess
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const seconds = (new Date(order.expiresAt) - new Date()) / 1000
            setTimeLeft(seconds);
            setSecondsLeft(Math.floor(seconds % 60));
            setMinutesLeft(Math.floor(seconds / 60));
        }
        calculateTimeLeft();
        const expiresTimer = setInterval(calculateTimeLeft, 1000);

        return () => {
            clearInterval(expiresTimer)
        }
    }, [order]);



    return (
        <div>
            <h1>Order {order.id}</h1>
            { timeLeft > 0 ? (
                <div>
                    <p>You got {minutesLeft} minutes and {secondsLeft} seconds to complete payment.</p>
                    <StripeCheckout
                        token={handlePurchase}
                        stripeKey={StripeKey}
                        amount={order.ticket.price * 100}
                        email={currentUser.email}
                    />
                    {errors}
                </div>
            ) : (
                <div>
                    <p>Order Expired</p>
                </div>
            )}

        </div>
    )
}

OrderShow.getInitialProps = async (ctx, client, currentUser) => {
    const {orderId} = ctx.query;
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {
        order: data,
        currentUser
    }
}

export default OrderShow;
