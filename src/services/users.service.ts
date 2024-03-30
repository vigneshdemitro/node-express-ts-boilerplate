import { User, UserModel } from '../models/user.model';
import logger from '../utils/logger';
import { hashPassword } from '../utils/utils';

export class UserService {

    constructor() {}

    async createUser(userDetails: User): Promise<[null | any, User | null]> {
        try {
            let user = userDetails;
            user.password = await hashPassword(user.password);
            const savedUser = await new UserModel(user).save();
            return [null, savedUser];
        } catch (error) {
            logger.error('Error', error);
            return [error, null];
        }
    }

    async updateUser(userId: string, userDetails: User): Promise<[null | any, User | null]> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(userId, userDetails, { new: true });
            return [null, updatedUser]
        } catch (error) {
            logger.error('Error', error);
            return [error, null]
        }
    }

    async deleteUser(userId: string): Promise<[null | any, User | null]> {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(userId);
            return [null, deletedUser];
        } catch (error) {
            logger.error('Error', error);
            return [error, null];
        }
    }

    async getUsers(): Promise<[null | any, Array<User> | null]> {
        try {
            const users = await UserModel.find().maxTimeMS(5000);
            if (!users || users.length === 0) {
                return [null, []];
            }
            return [null, users];
        } catch (error) {
            logger.error('Error', error);
            return [error, null];
        }
    }

    async getUserById(userId: string): Promise<[null | any, User | null]> {
        try {
            const user = await UserModel.findById(userId);
            return [null, user];
        } catch (error) {
            logger.error('Error', error);
            return [error, null];
        }
    }
}
