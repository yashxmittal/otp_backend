const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');
require("dotenv").config();
const { PORT, MONGODB_URI } = require("./config/config");

// create express app 
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// define a simple route
app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

require('./routes/otp.routes')(app);
require('./routes/user.routes')(app)




// page not found error handling  middleware
app.use("*", (req, res, next) => {
    const error = {
      status: 404,
      message: API_ENDPOINT_NOT_FOUND_ERR,
    };
    next(error);
  });
  
  // global error handling middleware
  app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || SERVER_ERR;
    const data = err.data || null;
    res.status(status).json({
      type: "error",
      message,
      data,
    });
  });

  (async function() {
    try {
      mongoose.Promise = global.Promise;
      mongoose.connect(MONGODB_URI);
      mongoose.connection.on('error', function() {
        console.log('Could not connect to the database. Exiting now...');
        process.exit();
    });
      mongoose.connection.once('open', function() {
        console.log("Successfully connected to the database");
    })  
      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  })();