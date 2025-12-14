interface PlayerRequest {
  id: string;
  username: string;
}

interface FriendCouple {
  playerId1: string;
  playerId2: string;
}

interface IRoutePayload {
  method: "POST" | "GET" | "PUT" | "DELETE";
  path: string;
}
