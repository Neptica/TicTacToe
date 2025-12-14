import express, { NextFunction, Request, Response, type Application } from 'express';
import appRoutes from './routes/routes';
import cors from 'cors';
import { CustomError, NotFoundException } from '~/config/error.core';
import HTTP_STATUS from '~/config/httpStatus';
import { connectToDatabase } from './config/dbConnection';
import dotenv from 'dotenv';
import getRoutes from '../utils/getRoutes';
dotenv.config();

class Server {
  private app: Application;
  constructor() {
    this.app = express();
  }

  public start() {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupGlobalError();
    this.setupDatabase();
    this.listenServer();
  }

  private setupRoutes() {
    appRoutes(this.app);
    const routes = getRoutes(this.app);
    console.log(routes);
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL! || '*',
        credentials: true // enable cookie
      })
    );
  }

  private setupGlobalError(): void {
    this.app.all(/(.*)/, (req, res, next) => {
      next(new NotFoundException(`The URL ${req.originalUrl} not found with method ${req.method}`));
    });

    // Global Error
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      // express will only run this function when error is passed as a param
      console.log('check error', error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER).json({
        message: 'Something went wrong!'
      });
    });
  }

  private setupDatabase() {
    try {
      connectToDatabase(process.env.MONGODB_URI ?? '');
      console.log('Connected to DB');
    } catch (error) {
      console.log('Failed to connect to DB');
    }
  }

  private listenServer() {
    const port = process.env.PORT || 5050;

    this.app.listen(port, () => {
      console.log(`Connected to server with port ${port}`);
    });
  }
}

export default Server;
