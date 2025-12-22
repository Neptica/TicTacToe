import { Player } from '~/server/models/player';
import Game from '../game/game';
import lobby from '../lobby/lobby';
import { BadRequestException, InternalServerError } from '~/config/error.core';
import mongoose from 'mongoose';

class MatchMaking {
  private waitlist: Array<string>;

  constructor() {
    this.waitlist = new Array<string>();
  }

  public addToWaitlist(playerReqId: string) {
    for (let playerId of this.waitlist) {
      if (playerId === playerReqId) {
        throw new BadRequestException('Player is already in waitlist');
      }
    }
    if (lobby.isInGame(playerReqId)) {
      throw new BadRequestException('Player is already in a match');
    }
    this.waitlist.push(playerReqId);
    this.tryInitMatch();
    return true;
  }

  private async tryInitMatch() {
    if (this.waitlist.length > 1) {
      let player1Req = this.waitlist.shift();
      let player2Req = this.waitlist.shift();
      if (!player1Req || !player2Req) {
        throw new InternalServerError('Failed to add players to a game');
      }
      const player1TrueId = new mongoose.Types.ObjectId(player1Req);
      const player2TrueId = new mongoose.Types.ObjectId(player2Req);
      let player1 = await Player.findById(player1TrueId).exec();
      let player2 = await Player.findById(player2TrueId).exec();
      if (player1 && player2) {
        let game = new Game(player1.getPlayerDetails, player2.getPlayerDetails);
        const gameId = lobby.createGame(game);
        lobby.addPlayerToMatch(player1.getObjectId, gameId);
        lobby.addPlayerToMatch(player2.getObjectId, gameId);
      } else {
        throw new Error('Matchmaking error');
      }
    }
  }
}

let matchMaker: MatchMaking = new MatchMaking();
export default matchMaker;
