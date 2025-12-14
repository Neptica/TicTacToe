import { Request, Response } from "express";
import { BadRequestException } from "~/config/error.core";
import { Friends } from "../models/friends";

class FriendService {
  public async GetAllFriends(req: Request, res: Response) {
    const playerId = req.params.playerId;
    if (!playerId) {
      throw new BadRequestException("No playerId found attached to call");
    }
    const friendList = await Friends.aggregate([
      {
        $match: {
          $or: [{ playerId1: playerId, playerId2: playerId }],
        },
      },
      {
        $project: {
          _id: 0,
          otherField: {
            $cond: [
              { $eq: ["$playerId1", playerId] },
              "$playerId1",
              "$playerId2",
            ],
          },
        },
      },
    ]).exec();
    return res
      .status(200)
      .json({ message: "fetched friends list", data: { friendList } });
  }

  public async RemoveFriend(req: Request, res: Response) {
    const players: FriendCouple = req.body;
    if (!players) {
      throw new BadRequestException("Post Body not found");
    }

    // The difference between who's first and last is who initiated the friendship
    const deleted = await Friends.deleteMany({
      $or: [
        { playerId1: players.playerId1, playerId2: players.playerId2 },
        { playerId1: players.playerId2, playerId2: players.playerId1 },
      ],
    }).exec();
    return res
      .status(200)
      .json({ message: `Deleted ${deleted.deletedCount} records` });
  }
}

export const friendService = new FriendService();
