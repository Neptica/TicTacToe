import { Request, Response } from 'express';
import { BadRequestException } from '~/config/error.core';
import { Friends } from '../models/friends';

class FriendService {
  public async GetAllFriends(req: Request, res: Response) {
    const playerId = req.params.playerid;
    if (!playerId) {
      throw new BadRequestException('No playerId found attached to call');
    }
    const friendList1 = await Friends.find({ playerId1: playerId }).select('playerId2').exec();
    const friendList2 = await Friends.find({ playerId2: playerId }).select('playerId1').exec();
    console.log(playerId, friendList1, friendList2);
    const friendsList = friendList1.concat(friendList2).map((obj) => {
      return { friendId: obj.playerId1 || obj.playerId2 };
    });

    return res.status(200).json({ message: 'fetched friends list', data: { friendsList } });
  }

  public async RemoveFriend(req: Request, res: Response) {
    const players: FriendCouple = req.body;
    if (!players) {
      throw new BadRequestException('Post Body not found');
    }

    // The difference between who's first and last is who initiated the friendship
    const deleted = await Friends.deleteMany({
      $or: [
        { playerId1: players.playerId1, playerId2: players.playerId2 },
        { playerId1: players.playerId2, playerId2: players.playerId1 }
      ]
    }).exec();
    return res.status(200).json({ message: `Deleted ${deleted.deletedCount} records` });
  }
}

export const friendService = new FriendService();
