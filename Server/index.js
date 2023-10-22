require("dotenv").config();
require('express-async-errors')
const express = require("express");
const app = express();
// const {v2: cloudinary} = require("cloudinary")

// packages
const morgan = require("morgan"); 
const cookieParser = require('cookie-parser')
const cors = require("cors")
// local includes

const postsRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require('./routes/userRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const connectDatabase = require("./config/mongoClient");


app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Server");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies)
  res.send("Welcome to the Server");
});

app.use("/api/v1/post", postsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter)
app.use("/api/v1/category", categoryRouter);


app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5001;
const start = async () => {
  try {
    await connectDatabase(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Database is connected & Server is running on Port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
