import mongoose from 'mongoose';

export interface IPlayer {
  trueId: string;
  username: string;
  mmr?: number;
}

const playerSchema = new mongoose.Schema(
  {
    playerId: { unique: true, type: String, required: true },
    username: { type: String, required: true },
    mmr: { type: Number, default: 600 }
  },
  {
    virtuals: {
      getPlayerDetails: {
        get() {
          const player: IPlayer = {
            trueId: this._id,
            username: this.username,
            mmr: this.mmr
          };
          return player;
        }
      },
      getObjectId: {
        get() {
          return this._id.toString();
        }
      },
      getUsername: {
        get() {
          return this.username;
        }
      }
    }
  }
);

export const Player = mongoose.model('Player', playerSchema);
