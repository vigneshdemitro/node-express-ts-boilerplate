import { Request, Response, Router } from 'express';
import userRouter from './user.routes';
import AuthRouter from './auth.routes';

const router: Router = Router();

router.use('/auth', AuthRouter);

router.use('/users', userRouter);

router.use('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to Api');
});

export default router;