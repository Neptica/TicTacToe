import mongoose, { Schema } from "mongoose";

// export interface IFriend {
// playerId:
// }

const FriendSchema = new Schema({
  playerId1: { type: String, required: true },
  playerId2: { type: String, required: true },
});

export const Friends = mongoose.model("Friend", FriendSchema);
