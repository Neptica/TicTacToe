import mongoose, { Schema } from "mongoose";

const FriendReqsSchema = new Schema({
  playerId1: { type: String, required: true },
  playerId2: { type: String, required: true },
});

export const FriendReqs = mongoose.model("FriendReqs", FriendReqsSchema);
