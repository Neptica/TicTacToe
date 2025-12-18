import { BadRequestException } from '~/config/error.core';
import { FriendReqs } from '../models/friendReqs';
import { Friends } from '../models/friends';

class FriendReqService {
  public async SendRequest(players: FriendCouple) {
    const ReqExists = await FriendReqs.findOne({
      playerId1: players.playerId1,
      playerId2: players.playerId2
    });

    if (ReqExists) {
      throw new BadRequestException('Request already exists');
    }

    const playerIsAccepting = await FriendReqs.findOne({
      playerId2: players.playerId1,
      playerId1: players.playerId2
    }).exec();

    if (playerIsAccepting) {
      // TODO: Check if already friends first
      const friendGrouping = new Friends({
        playerId2: players.playerId1,
        playerId1: players.playerId2
      });
      await friendGrouping.save();
      // Delete Previous Request
      await FriendReqs.deleteOne({
        playerId2: players.playerId1,
        playerId1: players.playerId2
      }).exec();
      return 'Friend Request Accepted';
    } else {
      const newReq = new FriendReqs({
        playerId1: players.playerId1,
        playerId2: players.playerId2
      });
      await newReq.save();
      return 'Friend Request Sent';
    }
  }
  public async GetIncoming(playerId: string) {
    const requestsAll = await FriendReqs.find({ playerId2: playerId }).exec();
    return requestsAll.map((req) => req.getRequest);
  }
}

export const friendReqService = new FriendReqService();
