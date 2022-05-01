import * as express from "express";
import { join } from "path";
import helmet from "helmet";
import * as proxy from "express-http-proxy";
import backend from "./backend/src";

const isProduction = process.env.NODE_ENV === "production";

const app = express();

if (isProduction) {
  app.use(helmet());
}

app.use("/api", backend);
app.get(
  "*",
  isProduction
    ? express.static(join(__dirname, "frontend", "build"))
    : proxy("http://localhost:2344")
);

const port = process.env.PORT || 2343;
app.listen(port, () => console.log("Crusty is running on port", port));
