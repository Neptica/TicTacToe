import { Request, Response } from 'express';
import { BadRequestException } from '~/config/error.core';
import { friendReqService } from '../services/friendReqService';

class FriendReqController {
  public async SendRequest(req: Request, res: Response) {
    const players: FriendCouple = req.body;
    if (!players) {
      throw new BadRequestException('Post body not found');
    }
    const result = await friendReqService.SendRequest(players);
    return res.status(200).json({ message: result });
  }

  public async IncomingRequests(req: Request, res: Response) {
    const playerId = req.params.playerId;
    if (!playerId) {
      throw new BadRequestException('No playerId found attached to call');
    }
    const requests = await friendReqService.GetIncoming(playerId);
    return res.status(200).json({
      message: 'Fetched incoming friend requests',
      data: { requests }
    });
  }
}

export const friendReqController = new FriendReqController();
