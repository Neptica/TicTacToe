import express from 'express';
import { userController } from '../controllers/userController';

const userRoute = express.Router();

userRoute.get('/getuser/:playerid', userController.getPlayer);

export default userRoute;
