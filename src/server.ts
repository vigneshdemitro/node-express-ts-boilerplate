import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import { connectToDatabase, disconnectFromDatabase } from "./models/database";
import router from "./routes/routes";
import { createResponse } from "./utils/utils";
import passport from "passport";
import passportConfig from "./middlewares/passport.config";
import logger from "./utils/logger";
import cors from "cors";
configDotenv();

class Server {
    private readonly port = process.env.PORT || 4001;
    private app: Application;
    constructor() {
        this.app = express();
        try {
            this.initializeMiddlewares();
            this.setRoutes();
            this.start();
            connectToDatabase();
        } catch (error) {
            this.shutdown();
        }
    }

    private initializeMiddlewares(): void {
        this.app.use(cors())
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(passport.initialize());
        passportConfig(passport);

        // Error handling mechanism
        const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
            if (err.name === 'ValidationError') {
                return res.status(400).json({ errors: err.array() });
            }
            logger.error(err);
            createResponse(res, { status: false, payload: err });
        };

        this.app.use(errorHandler as ErrorRequestHandler);
    }

    private setRoutes(): void {
        this.app.use('/api/v1', router);
    }

    private start(): void {
        this.app.listen(this.port, () => {
            logger.info(`Listening on port ${this.port}`)
        })
    }

    private async shutdown(): Promise<void> {
        logger.info('Shutting down...');
        await disconnectFromDatabase();
    }

}

export const serverInstance = new Server();