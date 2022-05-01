import * as express from "express";
import bodyParser from "body-parser";
import auth from "./auth";
import { RespondSuccess } from "../utils/response";

const app = express.Router();

app.use(bodyParser.json());

app.get("/", (req, res) => RespondSuccess(res, "Hello world"));

app.use("/auth", auth);

export default app;
