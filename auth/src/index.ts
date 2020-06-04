import mongoose from 'mongoose';
import {app} from "./app";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(3000, () => {
            console.log('Listening on 3000!');
        })
    } catch (e) {
        console.error(e);
    }
}
start();
