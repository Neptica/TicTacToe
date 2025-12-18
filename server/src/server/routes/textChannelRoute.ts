import express from 'express';
import { textChannelController } from '../controllers/textChannelController';

const textChannelRoute = express.Router();

textChannelRoute.get('/getfeed/:channelid', textChannelController.getFeedByChannel);
textChannelRoute.post('/postmessage', textChannelController.postToChannel);
textChannelRoute.post('/createchannel', textChannelController.createChannel);
textChannelRoute.get('/getchannels/:playerid', textChannelController.getChannels);

export default textChannelRoute;
