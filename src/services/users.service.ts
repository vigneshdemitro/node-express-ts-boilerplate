import { ObjectId } from 'mongodb';
import { User, UserModel } from '../models/user.model';
import logger from '../utils/logger';
import { hashPassword } from '../utils/utils';

export class UserService {

    constructor() { }

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

    async getUsers(filter?: Partial<User>): Promise<[null | any, Array<User> | null]> {
        try {
            let filters: any = {};
            if (filter) {
                const { _id, name, email, gender, role } = filter;
                if (name) {
                    filters.name = new RegExp(`[${name}]`, 'i');
                }
                if (email) {
                    filters.email = new RegExp(`[${email}]`, 'i');
                }
                if (_id) {
                    filters._id = new ObjectId(String(_id))
                }
                if (role) {
                    filters.role = role;
                }
                if (gender) {
                    filters.gender = gender;
                }
            }
            const users = await UserModel.find(filters).maxTimeMS(5000);
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
