import generateUUID from '~/utils/generateUUID';
import { Player } from '../models/player';
import { BadRequestException, InternalServerError, NotFoundException } from '~/config/error.core';

interface Message {
  sender: string;
  timestamp: string;
  message: string;
}

class Channel {
  private messages: Message[];
  private playerIds: Array<string>;
  private playerUsernames: Array<string | undefined>;

  constructor(playerIds: Array<string>, playerUsernames: Array<string | undefined>) {
    this.messages = new Array<Message>();
    this.playerIds = playerIds;
    this.playerUsernames = playerUsernames;
  }

  public getMessages() {
    return this.messages.map((msg) => {
      let sender: string | undefined = 'Error';
      for (let i = 0; i < this.playerIds.length; i++) {
        if (msg.sender === this.playerIds[i]) {
          sender = this.playerUsernames[i];
          break;
        }
      }
      return { ...msg, sender };
    });
  }

  public submitMessage(messageReq: IMessagePayload) {
    if (!this.playerIds.includes(messageReq.playerId)) {
      throw new BadRequestException('That player is not apart of this chat');
    }
    const msg: Message = { sender: messageReq.playerId, timestamp: '0', message: messageReq.message };
    this.messages.push(msg);
  }
}

class TextChannelService {
  private channels: Map<string, Channel>;
  private playerToChannels: Map<string, Array<string>>;

  constructor() {
    this.channels = new Map<string, Channel>();
    this.playerToChannels = new Map<string, Array<string>>();
  }

  public getFeedByChannel(channelId: string) {
    const channel = this.channels.get(channelId);
    if (!channel) {
      throw new BadRequestException('Channel could not be found');
    }
    return channel.getMessages();
  }

  public postToChannel(messageReq: IMessagePayload) {
    const channel = this.channels.get(messageReq.channelId);
    if (!channel) {
      throw new BadRequestException('Channel could not be found');
    }
    channel.submitMessage(messageReq);
    return channel.getMessages();
  }

  public async createChannel(players: Array<string>) {
    const channelId = generateUUID();

    let playersN = players.map((playerId) => Player.findById(playerId));
    const playerDocs = await Promise.all(playersN);

    playerDocs.forEach((playerDoc) => {
      if (!playerDoc) {
        throw new BadRequestException('Both players must have accounts registered');
      }
    });

    playerDocs.forEach((playerDoc) => {
      const playerId = playerDoc?.getObjectId;
      if (!playerDoc) {
        throw new NotFoundException('A required playerId was not found. The text channel was not created.');
      }
      this.addChannelToPlayer(playerId, channelId);
    });

    const playerIds = playerDocs.map((playerDoc) => playerDoc?.getObjectId);
    const playerUsernames = playerDocs.map((playerDoc) => playerDoc?.getUsername);

    if (playerIds.length !== playerUsernames.length) {
      throw new InternalServerError('This request to create a new channel has failed unexpectedly');
    } else {
      playerUsernames.forEach((username) => {
        if (!username) {
          throw new InternalServerError('This request to create a new channel has failed unexpectedly');
        }
      });
    }
    const newChannel = new Channel(playerIds, playerUsernames);

    this.channels.set(channelId, newChannel);
    return channelId;
  }

  public getChannelsByPlayer(playerId: string) {
    return this.playerToChannels.get(playerId);
  }

  private addChannelToPlayer(playerId: string, channelId: string) {
    if (!this.playerToChannels.get(playerId)) {
      this.playerToChannels.set(playerId, []);
    }
    // The below will never come up undefined
    (this.playerToChannels.get(playerId) || []).push(channelId);
  }
}

export const textChannelService = new TextChannelService();
