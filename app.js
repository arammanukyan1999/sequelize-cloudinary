const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const User = require('./Config/user')
const userRouter = require("./api/users/router");




app.use(express.json());

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(fileUpload({
  createParentPath: true
}));

app.use("/api/users", userRouter);

app.listen(process.env.PORT, () => console.log(`notes-app listening on port ${process.env.PORT}!`));


