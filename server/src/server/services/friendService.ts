import { Friends } from '../models/friends';

class FriendService {
  public async GetAllFriends(playerId: string) {
    const friendList1 = await Friends.find({ playerId1: playerId }).select('playerId2').exec();
    const friendList2 = await Friends.find({ playerId2: playerId }).select('playerId1').exec();
    console.log(playerId, friendList1, friendList2);
    const friendsList = friendList1.concat(friendList2).map((obj) => {
      return { friendId: obj.playerId1 || obj.playerId2 };
    });
    return friendsList;
  }
  public async RemoveFriends(players: FriendCouple) {
    // The difference between who's first and last is who initiated the friendship
    const deleted = await Friends.deleteMany({
      $or: [
        { playerId1: players.playerId1, playerId2: players.playerId2 },
        { playerId1: players.playerId2, playerId2: players.playerId1 }
      ]
    }).exec();
    return deleted.deletedCount;
  }
}

export const friendService = new FriendService();
