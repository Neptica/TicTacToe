import { Player } from '../models/player';

class UserService {
  public async getPlayer(playerId: string) {
    const player = await Player.findById(playerId);
    return player?.getPlayerDetails;
  }
}

export const userService = new UserService();
