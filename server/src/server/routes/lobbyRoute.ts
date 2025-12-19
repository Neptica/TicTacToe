import express from 'express';
import lobbyController from '../controllers/lobbyController';

const lobbyRoute = express.Router();

lobbyRoute.get('/gamestate/:gameid', lobbyController.getGameData);
lobbyRoute.post('/:gameid', lobbyController.makeMove);
lobbyRoute.post('/retireplayer/:playerid', lobbyController.retirePlayerFromGame);

export default lobbyRoute;
