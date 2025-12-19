import lobby from '~/features/lobby/lobby';
import { move } from '../middleware/zod/move';
import { BadRequestException } from '~/config/error.core';
import { Player } from '../models/player';

class LobbyService {
  public async getGameData(gameid: string) {
    lobby.getGameData(gameid);
  }
  public async makeMove(gameid: string, moveData: move) {
    const game = lobby.getGameFromPlayerId(gameid);
    if (!game) {
      throw new BadRequestException('Game not found');
    }

    game.makeMove(moveData);
  }
  public async retirePlayerFromGame(playerId: string) {
    const player = await Player.findOne({ playerId: playerId }).exec();
    if (!player) {
      throw new BadRequestException('Please create a player by joining a match first');
    }

    const isDisconnected = lobby.retirePlayerFromGame(player.getObjectId);

    if (!isDisconnected) {
      throw new BadRequestException('Failed to disconnect player from game');
    }
  }
}

export const lobbyService = new LobbyService();
