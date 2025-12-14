import { InternalServerError } from '~/config/error.core';
import { Player } from '~/server/models/player';

export const fetchPlayer = async (playerReq: PlayerRequest) => {
  const player = await Player.findOne({ playerId: playerReq.id }).exec();
  if (!player) {
    const newPlayer = new Player({
      playerId: playerReq.id,
      username: playerReq.username
    });
    newPlayer.save();
    return newPlayer.getPlayerDetails;
  }
  return player.getPlayerDetails;
};

export const fetchTrueId = async (playerReq: PlayerRequest) => {
  const player = await Player.findOne({ playerId: playerReq.id }).exec();
  if (!player) {
    const newPlayer = new Player({
      playerId: playerReq.id,
      username: playerReq.username
    });
    newPlayer.save();
    return newPlayer.getObjectId;
  }
  return player.getObjectId;
};
