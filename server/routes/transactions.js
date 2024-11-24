import express from "express";
import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User, UnAuthUser } from "../mongoSchemas.js";
import postTransactions from "./controllers/postTransactionsHandler.js";
import { authFunc } from "../authenticationHandler.js";
import { Transaction } from "../mongoSchemas.js";
import getTransactions from "./controllers/getTransactionsHandler.js";

const transactionsRoute = express.Router();

const api = "/api/1/users/transactions/";

transactionsRoute.post(api, authFunc, postTransactions);

transactionsRoute.get(api, authFunc, getTransactions);

export default transactionsRoute;
