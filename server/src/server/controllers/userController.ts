import { Request, Response } from 'express';
import { BadRequestException } from '~/config/error.core';
import { userService } from '../services/userService';

class UserController {
  public async getPlayer(req: Request, res: Response) {
    const playerId = req.params.playerid;
    if (!playerId) {
      throw new BadRequestException('PlayerId was not found in the url');
    }
    const player = await userService.getPlayer(playerId);
    return res.status(200).json({ message: 'Player retrieved', data: { player } });
  }
}

export const userController = new UserController();
