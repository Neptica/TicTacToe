import { Request, Response } from 'express';
import HTTP_STATUS from '~/config/httpStatus';
import { matchmakingService } from '../services/matchmakingService';

class MatchmakingController {
  public async addToMatchService(req: Request, res: Response) {
    const player: PlayerRequest = req.body;
    const trueId = await matchmakingService.addToMatch(player);
    return res.status(HTTP_STATUS.CREATED).json({ message: 'Queued for a match', data: { playerId: trueId } });
  }

  public async checkNewGame(req: Request, res: Response) {
    const { playerid } = req.params;
    const gameId = await matchmakingService.checkNewGame(playerid);
    return res.status(HTTP_STATUS.OK).json({ message: 'Game has been found', data: { gameId } });
  }
}

const matchmakingController = new MatchmakingController();
export default matchmakingController;
