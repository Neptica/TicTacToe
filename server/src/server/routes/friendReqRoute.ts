import express from 'express';
import { friendReqController } from '../controllers/friendReqController';

const friendReqRoute = express.Router();

friendReqRoute.post('/sendreq', friendReqController.SendRequest);
friendReqRoute.get('/listreqs/:playerId', friendReqController.IncomingRequests);

export default friendReqRoute;
