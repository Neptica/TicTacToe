import express from 'express';
import { friendController } from '../controllers/friendController';

const friendRoute = express.Router();

friendRoute.get('/fetchlist/:playerid', friendController.GetAllFriends);
friendRoute.post('/removefriend', friendController.RemoveFriend);

export default friendRoute;
