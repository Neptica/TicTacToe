import express from "express";
import { friendReqService } from "../services/friendReqService";

const friendReqRoute = express.Router();

friendReqRoute.post("/sendreq", friendReqService.SendRequest);
friendReqRoute.get("/listreqs/:playerId", friendReqService.IncomingRequests);

export default friendReqRoute;
