const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

const path = 'server/routes/';
const corsOptions = process.env.ORIGINS;

const files = fs.readdirSync(path);

app.use(express.json({limit: process.env.RES_SIZE}));
app.use(express.urlencoded({ extended: true, limit: process.env.REQ_SIZE }));
app.use(require('../body-params-parser/body-params-parser')());
app.use(cors(corsOptions));

files.forEach(file => {
    app.use(require(`../../routes/${file}`));
});

app.listen(process.env.PORT);