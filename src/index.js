import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config({
  path: "./.env",
});

const serverPort = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(serverPort, () => {
      console.log(`Server running on port: http://localhost:${serverPort}`);
    });
  })
  .catch((error) => {
    console.log("Server connection error", error);
  });
