import express from "express";
import { default as Router } from "./API/routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./utils/logger.js";
const app = express();
const port = 3001;

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan("combined", {
  stream: { write: (message) => logger.info(message.trim()) },
}));
app.use("/api/v1/upload", express.static("./upload"));
app.use("/api/v1", Router);

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
