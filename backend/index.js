const express = require("express");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
require("./src/strategy/local");
const connectDb = require("./src/util/db");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const path = require("path");

const userRouter = require("./src/router/user");
const authRouter = require("./src/router/auth");
const storyRouter = require("./src/router/story");
const { errorMiddleware } = require("./src/middleware/error");

const app = express();

app.use(
  cors({ origin: true, url: "http://localhost:5173/", credentials: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/story", storyRouter);
app.use(
  "/public/story",
  express.static(path.join(__dirname, "src/public/story"))
);
app.use(
  "/public/profile",
  express.static(path.join(__dirname, "src/public/profile"))
);

app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    const URI = process.env.MONGO_URI;
    await connectDb(URI);
    console.log("db connected");
    app.listen(PORT, () => {
      console.log(`server listening on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
