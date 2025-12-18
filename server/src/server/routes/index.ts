import type { Application } from 'express';
import matchMakingRoute from './matchMakingRoute';
import lobbyRoute from './lobbyRoute';
import friendRoute from './friendRoute';
import friendReqRoute from './friendReqRoute';

function appRoutes(app: Application) {
  const forerunner = '/api';
  app.use(`${forerunner}/matchmaking`, matchMakingRoute);
  app.use(`${forerunner}/lobby`, lobbyRoute);
  app.use(`${forerunner}/friends`, friendRoute);
  app.use(`${forerunner}/friendreqs`, friendReqRoute);
}

export default appRoutes;
