import express, {Request, Response} from 'express';
import { body } from "express-validator";
import jwt from 'jsonwebtoken';
import {PasswordHashUtil} from "../utils/password-hash-util";
import {User} from "../models/user";
import {BadRequestError, validateRequest} from "@tktbch/common";

const router = express.Router();
router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Invalid Email'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password.')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new BadRequestError('Invalid credentials');
        }

        const isAuthenticated = await PasswordHashUtil.compare(user.password, password);

        if (!isAuthenticated) {
            throw new BadRequestError('Invalid Credentials');
        }

        const userJwt = jwt.sign({
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!
        );
        // @ts-ignore
        req.session = { ...req.session, jwt: userJwt }
        res.status(200).send(user);
    })

export { router as signinRouter };
