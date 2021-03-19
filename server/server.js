require('./config/config.js');
const db = require('./libs/database/database');
db.connect();

require('./libs/router/router');

// console.log(__dirname);