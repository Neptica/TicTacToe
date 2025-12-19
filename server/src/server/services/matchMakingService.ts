import { BadRequestException, DuplicateRequestException } from '~/config/error.core';
import matchMaker from '~/features/matchmaking/matchmaking';
import { fetchTrueId } from '~/utils/fetchPlayer';
import { Player } from '../models/player';
import lobby from '~/features/lobby/lobby';

class MatchmakingService {
  public async addToMatch(player: PlayerRequest) {
    const trueId = await fetchTrueId(player);
    const isAdded = matchMaker.addToWaitlist(trueId);
    if (!isAdded) {
      throw new DuplicateRequestException('Player has already been added to queue');
    }
    return trueId;
  }
  public async checkNewGame(playerId: string) {
    const player = await Player.findById(playerId).exec();
    if (!player) {
      throw new BadRequestException('Please create a player by joining a match first');
    }
    return lobby.getGameId(player.getObjectId);
  }
}

export const matchmakingService = new MatchmakingService();
