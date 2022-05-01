import * as express from "express";
import { join } from "path";
import helmet from "helmet";
import backend from "./backend/src";

const app = express();

app.use(helmet());

app.use("/api", backend);
app.get("*", express.static(join(__dirname, "frontend", "build")));

const port = process.env.PORT || 2343;
app.listen(port, () => console.log("Crusty is running on port", port));
