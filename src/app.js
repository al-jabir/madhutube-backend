import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

// basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// cors configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// import routes

import healthcheckRouter from "./routes/healthcheckRoute.js";
import userRoute from "./routes/userRoute.js";
import videoRoute from "./routes/videoRoute.js";
import commentRoute from "./routes/commentRoute.js";
import likeRoute from "./routes/likeRoute.js";
import playlistRoute from "./routes/playlistRoute.js";
import subscriptionRoute from "./routes/subscriptionRoute.js";
import tweetRoute from "./routes/tweetRoute.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/videos", videoRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/likes", likeRoute);
app.use("/api/v1/playlists", playlistRoute);
app.use("/api/v1/subscriptions", subscriptionRoute);
app.use("/api/v1/tweets", tweetRoute);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to backend madhutube api...</h1>");
  console.log("cookies:", req.cookies);
});

app.use(errorHandler);

export default app;
