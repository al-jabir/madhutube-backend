import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { validateEnvironment, getEnvironmentInfo } from "./utils/envValidation.js";

dotenv.config({
  path: "./.env",
});

// Validate environment variables before starting
if (!validateEnvironment()) {
  console.error("❌ Server startup aborted due to missing environment variables.");
  process.exit(1);
}

const envInfo = getEnvironmentInfo();
console.log("🚀 Starting Madhutube Backend Server...");
console.log(`📦 Environment: ${envInfo.nodeEnv}`);
console.log(`🔌 Port: ${envInfo.port}`);
console.log(`☁️  Cloudinary: ${envInfo.hasCloudinary ? '✅ Configured' : '❌ Missing'}`);
console.log(`🗄️  MongoDB: ${envInfo.hasMongoDB ? '✅ Configured' : '❌ Missing'}`);
console.log(`🔐 JWT: ${envInfo.hasJWTSecrets ? '✅ Configured' : '❌ Missing'}`);

const serverPort = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(serverPort, () => {
      console.log(`🎉 Server running successfully on port: ${serverPort}`);
      console.log(`🌐 Access URL: http://localhost:${serverPort}`);
      console.log(`🏥 Health check: http://localhost:${serverPort}/api/v1/healthcheck`);
    });
  })
  .catch((error) => {
    console.error("❌ Server connection error:", error);
    process.exit(1);
  });
