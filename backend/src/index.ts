import * as express from "express";

const app = express.Router();

app.get("/", (req, res) => res.send("Hello from backend"));

export default app;
