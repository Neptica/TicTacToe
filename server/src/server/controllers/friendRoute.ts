import express from "express";
import { friendService } from "../services/friendServices";

const friendRoute = express.Router();

friendRoute.get("/fetchlist", friendService.GetAllFriends);
friendRoute.post("/removefriend", friendService.GetAllFriends);

export default friendRoute;
