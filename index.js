require('dotenv').config()
const connectToMongo=require('./db');
const express = require('express');
var cors = require('cors')
const app = express();
const port = process.env.PORT||5000;
app.use(cors());
app.use(express.json());
connectToMongo();
app.use('/auth',require('./routes/auth'));
app.use('/file',require('./routes/files'));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})