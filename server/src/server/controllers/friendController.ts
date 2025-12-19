import { Request, Response } from 'express';
import { BadRequestException } from '~/config/error.core';
import { friendService } from '../services/friendService';

class FriendController {
  public async GetAllFriends(req: Request, res: Response) {
    const playerId = req.params.playerid;
    if (!playerId) {
      throw new BadRequestException('No playerId found attached to call');
    }
    const friendsList = await friendService.GetAllFriends(playerId);
    return res.status(200).json({ message: 'fetched friends list', data: { friendsList } });
  }

  public async RemoveFriend(req: Request, res: Response) {
    const players: PlayerIdCoupling = req.body;
    if (!players) {
      throw new BadRequestException('Post Body not found');
    }
    const result = await friendService.RemoveFriends(players);
    return res.status(200).json({ message: `Deleted ${result} records` });
  }
}

export const friendController = new FriendController();
