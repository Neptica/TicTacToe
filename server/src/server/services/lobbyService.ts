import { Request, Response } from "express";
import HTTP_STATUS from "~/config/httpStatus";
import lobby from "~/features/lobby/lobby";
import { Move } from "../middleware/zod/move";
import { BadRequestException } from "~/config/error.core";
import { ObjectId } from "mongoose";
import { Player } from "../models/player";

class LobbyService {
  public async getGameData(req: Request, res: Response) {
    const { gameid } = req.params;
    const gameData = lobby.getGameData(gameid);
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Game data retrieved", data: { gameData } });
  }

  public makeMove(req: Request, res: Response) {
    const { gameid } = req.params;
    const moveData = Move.parse(req.body);
    console.log(moveData);
    if (!moveData) {
      throw new BadRequestException("Incomplete request");
    }

    const game = lobby.getGameFromPlayerId(gameid);
    if (!game) {
      throw new BadRequestException("Game not found");
    }

    game.makeMove(moveData);
    return res.status(HTTP_STATUS.OK).json({ message: "Move succeeded" });
  }

  public async retirePlayerFromGame(req: Request, res: Response) {
    const { playerid } = req.params;
    if (!playerid) {
      throw new BadRequestException("No Player Id parameter");
    }

    const player = await Player.findOne({ playerId: playerid }).exec();
    if (!player) {
      throw new BadRequestException(
        "Please create a player by joining a match first",
      );
    }

    const isDisconnected = lobby.retirePlayerFromGame(player.getObjectId);

    if (!isDisconnected) {
      throw new BadRequestException("Failed to disconnect player from game");
    }
    return res.status(HTTP_STATUS.OK).json({ message: "Disconnect from game" });
  }
}

const lobbyService = new LobbyService();
export default lobbyService;
