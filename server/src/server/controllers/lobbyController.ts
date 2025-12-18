import { Request, Response } from 'express';
import HTTP_STATUS from '~/config/httpStatus';
import { Move } from '../middleware/zod/move';
import { BadRequestException } from '~/config/error.core';
import { lobbyService } from '../services/lobbyService';

class LobbyController {
  public async getGameData(req: Request, res: Response) {
    const { gameid } = req.params;
    const gameData = await lobbyService.getGameData(gameid);
    return res.status(HTTP_STATUS.OK).json({ message: 'Game data retrieved', data: { gameData } });
  }

  public makeMove(req: Request, res: Response) {
    const { gameid } = req.params;
    const moveData = Move.parse(req.body);
    if (!moveData) {
      throw new BadRequestException('Incomplete request');
    }
    lobbyService.makeMove(gameid, moveData);

    return res.status(HTTP_STATUS.OK).json({ message: 'Move succeeded' });
  }

  public async retirePlayerFromGame(req: Request, res: Response) {
    const { playerid } = req.params;
    if (!playerid) {
      throw new BadRequestException('No Player Id parameter');
    }
    await lobbyService.retirePlayerFromGame(playerid);
    return res.status(HTTP_STATUS.OK).json({ message: 'Disconnect from game' });
  }
}

const lobbyController = new LobbyController();
export default lobbyController;
