import express from "express";
import { authFunc } from "../authenticationHandler.js";
import { refreshAuth } from "../authenticationHandler.js";
import refreshToken from "./controllers/refreshTokenHandler.js";
import { registrationAuth } from "../authenticationHandler.js";
import confirmation from "./controllers/confirmationHandler.js";

const authenticationRoutes = express.Router();

const api = "/api/1/";

authenticationRoutes.get(api + "verify-token", authFunc, async (req, res) => {
  return res.status(200).send("verification succeed!");
});

authenticationRoutes.post(api + "refresh", refreshAuth, refreshToken);

authenticationRoutes.post(api + "confirmation", registrationAuth, confirmation);

authenticationRoutes
  .route(api + "refresh-code")
  .post(async (req, res, next) => {});

export default authenticationRoutes;
