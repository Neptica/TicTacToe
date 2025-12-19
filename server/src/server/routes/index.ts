import type { Application } from 'express';
import matchMakingRoute from './matchMakingRoute';
import lobbyRoute from './lobbyRoute';
import friendRoute from './friendRoute';
import friendReqRoute from './friendReqRoute';
import textChannelRoute from './textChannelRoute';

function appRoutes(app: Application) {
  const forerunner = '/api';
  app.use(`${forerunner}/matchmaking`, matchMakingRoute);
  app.use(`${forerunner}/lobby`, lobbyRoute);
  app.use(`${forerunner}/friends`, friendRoute);
  app.use(`${forerunner}/friendreqs`, friendReqRoute);
  app.use(`${forerunner}/textchannels`, textChannelRoute);
}

export default appRoutes;
