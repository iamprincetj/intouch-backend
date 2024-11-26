require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
console.log(process.env.PORT);

const DATABASE_URL = NODE_ENV === 'development' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

export { DATABASE_URL, PORT, JWT_SECRET };
