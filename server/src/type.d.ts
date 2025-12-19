interface PlayerRequest {
  id: string;
  username: string;
}

interface PlayerIdCoupling {
  playerId1: string;
  playerId2: string;
}

interface IRoutePayload {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  path: string;
}

interface IFriendRequest {
  id: string;
  from: string;
}

interface IMessagePayload {
  channelId: string;
  playerId: string;
  message: string;
}
