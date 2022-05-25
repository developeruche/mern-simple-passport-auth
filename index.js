// import lib
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/User");


// init app
const app = express();

// Implementing middleware
app.use(cookieParser());
app.use(express.json());


// declaration of application variables
const PORT = process.env.PORT || 5000;


// connecting to the mongo db 
mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connection has been establish successfully...");
}).catch(err > console.log(err))


// adding route to the express application
app.use("/user", userRouter);


// starting the server
app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`);
});