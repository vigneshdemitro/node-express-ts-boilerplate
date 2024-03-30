import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { ValidationChain, body } from "express-validator";
import passport from "passport";
import { isAuthorizedRole } from "../middlewares/passport.config";

const validateUserDetails = [
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isString(),
    body('role').notEmpty().isString().isIn(['super_admin', 'admin', 'user']),
    body('name').optional().notEmpty().isString(),
    body('gender').optional().notEmpty().isString().isIn(['male', 'female', 'other']),
];

const validateUpdateUserDetails: ValidationChain[] = [
    body('email').optional().notEmpty().isEmail(),
    body('password').optional().notEmpty().isString(),
    body('role').optional().notEmpty().isString().isIn(['super_admin', 'admin', 'user']),
    body('name').optional().notEmpty().isString(),
    body('gender').optional().notEmpty().isString().isIn(['male', 'female', 'other']),
];

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', validateUserDetails, userController.createUser.bind(userController));
userRouter.get('/', passport.authenticate('jwt', { session: false }), isAuthorizedRole(['admin', 'user']), userController.getUsers.bind(userController));
userRouter.put('/user/:userId?', passport.authenticate('jwt', { session: false }), isAuthorizedRole(['user', 'admin']), validateUpdateUserDetails, userController.updateUser.bind(userController));
userRouter.get('/user/:userId?', passport.authenticate('jwt', { session: false }), isAuthorizedRole(['user', 'admin']), userController.getUserById.bind(userController));
userRouter.delete('/user/:userId?', passport.authenticate('jwt', { session: false }), isAuthorizedRole(['admin']), userController.deleteUser.bind(userController));

export default userRouter;