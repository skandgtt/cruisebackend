const dotenv = require('dotenv');
const path = require('path');

// Go up two levels from config directory to reach the root where .env is
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

module.exports = {
    WIDGETY_TOKEN: process.env.WIDGETY_APP_TOKEN,
    WIDGETY_APP_ID: process.env.WIDGETY_APP_ID,
    PORT: process.env.PORT || 3000,
    WIDGETY_BASE_URL: 'https://www.widgety.co.uk/api'
}; 