import { Request, Response } from "express";
import { BadRequestException } from "~/config/error.core";
import { FriendReqs } from "../models/friendReqs";
import { Friends } from "../models/friends";

class FriendReqService {
  public async SendRequest(req: Request, res: Response) {
    const players: FriendCouple = req.body;
    if (!players) {
      throw new BadRequestException("Post body not found");
    }

    const ReqExists = await FriendReqs.findOne({
      playerId1: players.playerId1,
      playerId2: players.playerId2,
    });

    if (ReqExists) {
      throw new BadRequestException("Request already exists");
    }

    const playerIsAccepting = await FriendReqs.findOne({
      playerId2: players.playerId1,
      playerId1: players.playerId2,
    }).exec();

    if (playerIsAccepting) {
      const friendGrouping = new Friends({
        playerId2: players.playerId1,
        playerId1: players.playerId2,
      });
      await friendGrouping.save();
      // Delete Previous Request
      await FriendReqs.deleteOne({
        playerId2: players.playerId1,
        playerId1: players.playerId2,
      }).exec();
    } else {
      const newReq = new FriendReqs({
        playerId1: players.playerId1,
        playerId2: players.playerId2,
      });
      await newReq.save();
    }
    return res.status(200).json({ message: "Friend Request Sent" });
  }

  public async IncomingRequests(req: Request, res: Response) {
    const playerId = req.params.playerId;
    if (!playerId) {
      throw new BadRequestException("No playerId found attached to call");
    }
    const requests = await FriendReqs.find({ playerid2: playerId }).exec();
    return res.status(200).json({
      message: "Fetched incoming friend requests",
      data: { requests },
    });
  }
}

export const friendReqService = new FriendReqService();
