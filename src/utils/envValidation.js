/**
 * Environment Variables Validation Utility
 * Ensures all required environment variables are present before starting the server
 */

const requiredEnvVars = [
    'MONGODB_URI',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

const optionalEnvVars = [
    'PORT',
    'CORS_ORIGIN',
    'ACCESS_TOKEN_EXPIRY',
    'REFRESH_TOKEN_EXPIRY',
    'NODE_ENV'
];

export const validateEnvironment = () => {
    console.log("🔍 Validating environment variables...");

    const missing = [];
    const present = [];

    // Check required variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        } else {
            present.push(varName);
            // Mask sensitive variables in logs
            const isSensitive = varName.includes('SECRET') || varName.includes('KEY');
            const displayValue = isSensitive ? '***HIDDEN***' : process.env[varName];
            console.log(`✅ ${varName}: ${displayValue}`);
        }
    });

    // Check optional variables
    optionalEnvVars.forEach(varName => {
        if (process.env[varName]) {
            present.push(varName);
            console.log(`✅ ${varName}: ${process.env[varName]}`);
        } else {
            console.log(`⚠️  ${varName}: Not set (optional)`);
        }
    });

    if (missing.length > 0) {
        console.error("❌ Missing required environment variables:");
        missing.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error("\n📝 Please check your .env file and ensure all required variables are set.");
        console.error("📖 Refer to README.md for the complete list of required environment variables.");
        return false;
    }

    console.log(`✅ Environment validation passed! ${present.length} variables configured.`);
    return true;
};

export const getEnvironmentInfo = () => {
    return {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000,
        hasCloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
        hasMongoDB: !!process.env.MONGODB_URI,
        hasJWTSecrets: !!(process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET)
    };
};