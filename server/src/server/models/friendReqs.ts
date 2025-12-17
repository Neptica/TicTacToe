import mongoose from 'mongoose';

const friendReqsSchema = new mongoose.Schema(
  {
    playerId1: { type: String, required: true },
    playerId2: { type: String, required: true }
  },
  {
    virtuals: {
      getRequest: {
        get() {
          const req: IFriendRequest = { id: this._id, from: this.playerId1 };
          return req;
        }
      }
    }
  }
);

export const FriendReqs = mongoose.model('FriendReqs', friendReqsSchema);
