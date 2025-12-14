import type { Application } from 'express';
import testRoute from '../controllers/testRoute';
import matchMakingRoute from '../controllers/matchMakingRoute';
import lobbyRoute from '../controllers/lobbyRoute';
import friendRoute from '../controllers/friendRoute';
import friendReqRoute from '../controllers/friendReqRoute';

function appRoutes(app: Application) {
  const forerunner = '/api';
  app.use(`${forerunner}/test`, testRoute);
  app.use(`${forerunner}/matchmaking`, matchMakingRoute);
  app.use(`${forerunner}/lobby`, lobbyRoute);
  app.use(`${forerunner}/friends`, friendRoute);
  app.use(`${forerunner}/friendreqs`, friendReqRoute);
}

export default appRoutes;
