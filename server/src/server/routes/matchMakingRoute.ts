import express from 'express';
import matchmakingController from '../controllers/matchMakingController';

const matchMakingRoute = express.Router();

matchMakingRoute.post('/add', matchmakingController.addToMatchService);
matchMakingRoute.get('/checkgame/:playerid', matchmakingController.checkNewGame);

export default matchMakingRoute;
