import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IGameRecord {
  player1Id: string,
  player2Id: string,
  winner: string,
}

const gameRecordSchema: Schema = new Schema({
  player1Id: {type: String, required: true },
  player2Id: {type: String, required: true },
  winner: {type: String, required: false, default: "" },
});

export const GameRecord = mongoose.model<IGameRecord>("Game", gameRecordSchema);