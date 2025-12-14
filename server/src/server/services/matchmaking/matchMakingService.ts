import { Request, Response } from "express";
import matchMaker from "~/features/matchmaking/matchmaking";
import HTTP_STATUS from "~/config/httpStatus";
import {
  BadRequestException,
  DuplicateRequestException,
} from "~/config/error.core";
import lobby from "~/features/lobby/lobby";
import { fetchTrueId } from "~/utils/fetchPlayer";
import { Player } from "~/server/models/player";

class MatchMakingService {
  public async addToMatchService(req: Request, res: Response) {
    const player: PlayerRequest = req.body;
    const trueId = await fetchTrueId(player);
    const isAdded = matchMaker.addToWaitlist(trueId);
    if (!isAdded) {
      throw new DuplicateRequestException(
        "Player has already been added to queue",
      );
    }
    return res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "Queued for a match", data: { playerId: trueId } });
  }

  public async checkNewGame(req: Request, res: Response) {
    const { playerid } = req.params;
    const player = await Player.findById(playerid).exec();
    if (!player) {
      throw new BadRequestException(
        "Please create a player by joining a match first",
      );
    }
    const isGameStart = lobby.getGameId(player.getObjectId);
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Game has been found", data: { gameId: isGameStart } });
  }
}

const matchMakingService: MatchMakingService = new MatchMakingService();
export default matchMakingService;
