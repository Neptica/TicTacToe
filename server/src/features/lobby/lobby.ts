import { BadRequestException, NotFoundException } from "~/config/error.core";
import Game from "../game/game";
import generateUUID from "~/utils/generateUUID";

class Lobby {
  private lobbies: Map<string, string>;
  private games: Map<string, Game>;

  constructor() {
    // TODO: Make a timer to self destruct games and remove people from lobbies
    this.lobbies = new Map<string, string>();
    this.games = new Map<string, Game>();
  }

  public addPlayerToMatch(playerId: string, gameId: string) {
    this.lobbies.set(playerId, gameId);
  }

  public createGame(game: Game) {
    const Id = generateUUID();
    this.games.set(Id, game);
    return Id;
  }

  public isInGame(playerId: string) {
    if (this.lobbies.get(playerId) !== undefined) {
      return true;
    }
    return false;
  }

  public getGameId(playerId: string) {
    const gameId = this.lobbies.get(playerId);
    if (!gameId) {
      throw new NotFoundException("Player is not currently in a match");
    }
    return gameId;
  }

  public getGameFromPlayerId(gameId: string) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new NotFoundException("Game Id dangles");
    }
    return game;
  }

  public getGameData(gameId: string) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new NotFoundException("Game not found");
    }
    return game.getGameDetails();
  }

  public retirePlayerFromGame(playerId: string) {
    console.log(playerId, this.lobbies);
    if (this.lobbies.get(playerId) === undefined) {
      throw new BadRequestException("No game to retire the player from");
    }
    const gameId = this.lobbies.get(playerId);
    if (!gameId) {
      throw new BadRequestException("Game has been corrupted");
    }
    const game = this.games.get(gameId);
    const gameIsEmpty = game?.disconnectPlayer(playerId);
    if (gameIsEmpty) {
      this.games.delete(gameId);
    }
    this.lobbies.delete(playerId);
    return this.lobbies.get(playerId) === undefined;
  }
}

const lobby: Lobby = new Lobby();
export default lobby;
