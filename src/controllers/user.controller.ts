import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserService } from "../services/users.service";
import { User } from "../models/user.model";
import { createResponse } from "../utils/utils";
import { MongooseError } from "mongoose";
import { ObjectId } from "mongodb";

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async createUser(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return createResponse(res, { status: false, payload: errors.array() })
        }
        const userDetails = req.body as User;
        const [error, user] = await this.userService.createUser(userDetails);
        if (error) {
            return createResponse(res, { status: false, payload: error });
        }
        return createResponse(res, { status: true, payload: { user } });
    }

    async updateUser(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return createResponse(res, { status: false, payload: errors.array() })
        }
        const userDetails = req.body as User;
        const [error, user] = await this.userService.updateUser(req.params.userId, userDetails);
        if (error) {
            createResponse(res, { status: false, payload: error });
        }
        return createResponse(res, { status: true, payload: { user } });
    }

    async deleteUser(req: Request, res: Response) {
        const [error, user] = await this.userService.deleteUser(req.params.userId);
        if (error) {
            return createResponse(res, { status: false, payload: error });
        }
        return createResponse(res, { status: true, payload: { user } });
    }

    async getUsers(req: Request, res: Response) {
        const [error, users] = await this.userService.getUsers();
        if (error) {
            let errors = error;
            if (error instanceof MongooseError) errors = error.message;
            return createResponse(res, { status: false, payload: errors });
        }
        return createResponse(res, { status: true, payload: users });
    }

    async getUserById(req: Request, res: Response) {
        let userId = req.params.userId;
        const authUser = req.user as User;
        if (authUser.role === 'user') {
            userId = String(authUser._id);
        }
        const [error, user] = await this.userService.getUserById(userId);
        if (error) {
            let errors = error;
            if (error instanceof MongooseError) errors = error.message;
            return createResponse(res, { status: false, payload: errors });
        }
        return createResponse(res, { status: true, payload: user });
    }
}


