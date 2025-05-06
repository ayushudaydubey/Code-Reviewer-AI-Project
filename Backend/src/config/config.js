import dotenv from 'dotenv';
dotenv.config();

const _config = {
  PORT : process.env.PORT,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  MONGO_DB_URL: process.env.MONGO_DB_URL,

};

export default Object.freeze(_config);
