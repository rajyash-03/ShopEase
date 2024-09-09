const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userCtrl=require("./controllers/userctrl")
// const multer = require('multer');
// const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.json({ msg: "this is example" });
});

app.listen(PORT, () => {
  console.log("SERVER IS RUNNING");
});

//Routes
app.use("/user", require("./routes/useRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use('/api',require('./routes/upload'))
app.use("/api", require("./routes/productRouter"));

app.post('/user/refresh_token', userCtrl.refreshtoken);

//connect MONGODB
const URI = process.env.MONGODB_URL;

mongoose
  .connect(URI, {
    // usecreateIndex:true,
    // useFindAndModify:false,
    // useNewurlParser:true,
    // useUnifiestopology:true
  })
  .then(() => {
    console.log("MongoDb connnected");
  })
  .catch((err) => {
    console.log(err);
  });
