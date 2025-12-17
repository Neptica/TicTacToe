import express from 'express';
import { friendService } from '../services/friendServices';

const friendRoute = express.Router();

friendRoute.get('/fetchlist/:playerid', friendService.GetAllFriends);
friendRoute.post('/removefriend', friendService.RemoveFriend);

export default friendRoute;
