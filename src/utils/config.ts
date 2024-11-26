require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;

const DATABASE_URL = NODE_ENV === 'production' ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL_DEV;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

export { DATABASE_URL, PORT, JWT_SECRET };
