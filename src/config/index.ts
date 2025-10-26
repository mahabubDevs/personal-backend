import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
console.log("Stripe Key from ENV:", process.env.STRIPE_API_SECRET);
export default {
  ip_address: process.env.IP_ADDRESS,
  port: process.env.PORT,
  // api_url: process.env.API_URL,

  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    jwt_secret: process.env.JWT_SECRET || "jwt_secret",
    jwt_expire_in: process.env.JWT_EXPIRE_IN || "1d",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refresh_secret",
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  stripe: {
    stripeSecretKey: process.env.STRIPE_API_SECRET,
    webhookSecret: process.env.WEBHOOK_SECRET,
    // paymentSuccess: process.env.WEBHOOK_SECRET,
    paymentSuccess: process.env.STRIPE_PAYMENT_SUCCESS,
  },
  email: {
    from: process.env.EMAIL_FROM,
    user: process.env.EMAIL_USER,
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
  },
  social: {
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    facebook_client_id: process.env.FACEBOOK_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    facebook_client_secret: process.env.FACEBOOK_CLIENT_SECRET,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_NUMBER,
  },
  frontendUrl: process.env.FRONTEND_URL,
};
