import lobby from '~/features/lobby/lobby';
import { move } from '../middleware/zod/move';
import { BadRequestException, NotFoundException } from '~/config/error.core';
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

    const [winnerId, loserId] = game.makeMove(moveData);
    if (winnerId) {
      const players = await Promise.all([Player.findById(winnerId), Player.findById(loserId)]);
      if (!players[0] || !players[1]) {
        throw new NotFoundException('Could not find each player in the database. MMR will not be granted');
      }
      const mmrs = [players[0]?.getPlayerDetails.mmr, players[1]?.getPlayerDetails.mmr];
      if (!mmrs[0]) {
        mmrs[0] = 600;
      }
      if (!mmrs[1]) {
        mmrs[1] = 600;
      }
      const gain = 30 + Math.round((mmrs[0] - mmrs[1]) / 10);
      players[0].mmr += gain;
      players[1].mmr -= gain;
      await Promise.all([players[0].save(), players[1].save()]);
    }
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
