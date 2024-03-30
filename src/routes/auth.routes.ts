import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
import { createResponse, formatUser } from "../utils/utils";
import { configDotenv } from "dotenv";
import { MongooseError } from "mongoose";
import { compare } from "bcrypt";
import { UserService } from "../services/users.service";
configDotenv();

export const generateToken = (user: User) => jwt.sign({
    _id: user._id,
    email: user.email,
    role: user.role,
},
    process.env.JWT_SECRET || 'check');

const AuthRouter = Router();

AuthRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as Partial<User>;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return createResponse(res, { status: false, payload: { message: 'Invalid email or password' } });
        }
        const isValidPassword = await compare(password!, user.password);
        if (!isValidPassword) {
            return createResponse(res, { status: false, payload: { message: 'Incorrect password' } });
        }
        const userDetails = formatUser(user, generateToken(user));
        return createResponse(res, { status: true, payload: userDetails });
    } catch (error) {
        let errors = error;
        if (error instanceof MongooseError) errors = error.message;
        return createResponse(res, { status: false, payload: errors });
    }
});

AuthRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userDetails = req.body as User;
        const [error, savedUser] = await new UserService().createUser(userDetails);
        if (!savedUser || error) {
            let errors = error;
            if (error instanceof MongooseError) errors = error.message;
            return createResponse(res, { status: false, payload: errors });
        }
        const user = await UserModel.findOne({ email: savedUser.email });
        const newUser = formatUser(user!, generateToken(user!))
        return createResponse(res, { status: true, payload: newUser });
    } catch (error) {
        let errors = error;
        if (error instanceof MongooseError) errors = error.message;
        return createResponse(res, { status: false, payload: errors });
    }
})

export default AuthRouter;
