class Board {
  private board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  public getSquare(i: number, j: number) {
    return this.board[i][j];
  }

  public setSquare(i: number, j: number, letter: string) {
    if (this.board[i][j] === '') {
      this.board[i][j] = letter;
      return true;
    } else {
      return false;
    }
  }

  public getGameBoard() {
    return this.board;
  }

  public checkWinner() {
    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] !== '' && this.board[i][0] === this.board[i][1] && this.board[i][0] === this.board[i][2]) {
        return this.board[i][0];
      }
      if (this.board[0][i] !== '' && this.board[0][i] === this.board[1][i] && this.board[0][i] === this.board[2][i]) {
        return this.board[0][i];
      }
      if (this.board[0][0] !== '' && this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
        return this.board[1][1];
      }
      if (this.board[2][0] !== '' && this.board[2][0] === this.board[1][1] && this.board[0][0] === this.board[0][2]) {
        return this.board[1][1];
      }
    }
    return undefined;
  }
}

export default Board;
