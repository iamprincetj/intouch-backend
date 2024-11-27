require('dotenv').config();

console.log(process.env.PORT);

const DATABASE_URL = process.env.DATABASE_URL_PROD;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

export { DATABASE_URL, PORT, JWT_SECRET };
