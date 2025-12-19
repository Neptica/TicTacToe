import { Request, Response } from 'express';
import { textChannelService } from '../services/textChannelService';
import { BadRequestException } from '~/config/error.core';

class TextChannelController {
  public async getFeedByChannel(req: Request, res: Response) {
    const channelId = req.params.channelid;
    const channel = textChannelService.getFeedByChannel(channelId);
    return res.status(200).json({ message: 'Text Channel Retrieved', data: { channel } });
  }
  public async postToChannel(req: Request, res: Response) {
    const message: IMessagePayload = req.body;
    if (!message) {
      throw new BadRequestException('Incorrect request body');
    }
    const channel = textChannelService.postToChannel(message);
    return res.status(200).json({ message: 'Text Channel Updated', data: { channel } });
  }
  public async createChannel(req: Request, res: Response) {
    const players: Array<string> = req.body.playerIds;
    if (!players) {
      throw new BadRequestException('Incorrect request body');
    }
    const channelId = await textChannelService.createChannel(players);
    res.status(200).json({ message: 'Text Channel Created Successfully', data: { channelId } });
  }

  public getChannels(req: Request, res: Response) {
    const playerId = req.params.playerid;
    if (!playerId) {
      throw new BadRequestException('Incorrect request body');
    }
    const channels = textChannelService.getChannelsByPlayer(playerId);
    return res.status(200).json({ message: "Retrieved the player's channels", data: { channels } });
  }
}

export const textChannelController = new TextChannelController();
