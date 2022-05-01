import * as express from "express";
import bodyParser from "body-parser";
import auth from "./auth";

const app = express.Router();

app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello from backend"));

app.use("/auth", auth);

export default app;
