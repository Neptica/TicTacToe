import { move } from "~/server/middleware/zod/move";
import Board from "./board";
import { BadRequestException } from "~/config/error.core";
import { IPlayer } from "~/server/models/player";
import { GameRecord } from "~/server/models/game";

class Game {
  private board: Board;
  private player1: IPlayer;
  private player2: IPlayer;
  private player1Turn: boolean;
  private winner: string | undefined;
  private player1Disconnected: boolean;
  private player2Disconnected: boolean;

  constructor(player1: IPlayer, player2: IPlayer) {
    this.board = new Board();
    this.player1 = player1;
    this.player2 = player2;
    this.player1Turn = true;
    this.player1Disconnected = false;
    this.player2Disconnected = false;
  }

  public startRematch() {
    this.board = new Board();
    this.player1Turn = true;
  }

  public getGameDetails() {
    const board = this.board.getGameBoard();
    const player1 = this.player1;
    const player2 = this.player2;
    const gameWinner = this.winner;
    return { board, player1, player2, gameWinner };
  }

  public makeMove(move: move) {
    if (typeof this.winner === undefined) {
      throw new BadRequestException(`Player ${this.winner} has already won`);
    }
    let playerToMove: IPlayer;
    let playerToWait: IPlayer;
    if (this.player1Turn) {
      playerToMove = this.player1;
      playerToWait = this.player2;
    } else {
      playerToMove = this.player2;
      playerToWait = this.player1;
    }

    if (move.trueId != playerToMove.trueId) {
      if (move.trueId == playerToWait.trueId) {
        throw new BadRequestException("Not your turn bimbo");
      } else {
        throw new BadRequestException("This Id is not apart of this game");
      }
    }

    if (!(0 <= move.i && move.i < 3)) {
      throw new BadRequestException("'i' is not in bounds");
    }
    if (!(0 <= move.j && move.j < 3)) {
      throw new BadRequestException("'j' is not in bounds");
    }

    const symbol = this.player1Turn ? "X" : "O";
    const moved = this.board.setSquare(move.i, move.j, symbol);
    if (!moved) {
      throw new BadRequestException("Square already filled");
    }

    this.player1Turn = !this.player1Turn;
    const winningLetter = this.board.checkWinner();
    if (winningLetter) {
      if (winningLetter === "X") {
        this.winner = this.player1.trueId;
      } else if (winningLetter === "O") {
        this.winner = this.player2.trueId;
      }
    }
  }

  public disconnectPlayer(playerId: string) {
    if (playerId === this.player1.trueId) {
      this.player1Disconnected = true;
    } else if (playerId === this.player2.trueId) {
      this.player2Disconnected = true;
    }
    if (this.player1Disconnected && this.player2Disconnected) {
      this.retireGame();
      return true;
    }
  }

  private retireGame() {
    const gameRecord = new GameRecord({
      player1Id: this.player1.trueId,
      player2Id: this.player2.trueId,
      winner: this.winner,
    });
    gameRecord.save();
  }
}

export default Game;
