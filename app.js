require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require('passport')
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

require("./config/passport-setup");

mongoose.connect(process.env.MONGOOSE_URI, () => {
  console.log("connected to mongodb");
});

const app = express();

app.use(cookieSession({
  maxAge: 1000 * 60 * 60 * 24,
  keys: [process.env.COOKIE_KEY]
}))

app.use(passport.initialize())
app.use(passport.session())

app.set("view engine", "ejs");

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res.render('home', { user: req.user });
});

app.listen(3000, () => {
  console.log("app now listening for requests on port 3000");
});
