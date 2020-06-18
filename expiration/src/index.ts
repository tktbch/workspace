import {natsWrapper} from "./nats-wrapper";
import {OrderCreatedListener} from "./events/order-created-listener";

const start = async () => {
    console.log("starting expiration");
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID is not defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID is not defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL is not defined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
    } catch (e) {
        console.error(e);
    }
}
start();
