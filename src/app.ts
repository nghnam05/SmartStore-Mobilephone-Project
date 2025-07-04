import express from "express";
import methodOverride from "method-override";

import "dotenv/config";
import dotenv from "dotenv";
const app = express();
const PORT = process.env.PORT || 8080;
import webRoutes from "./routes/web";
import getConnect from "./config/database";
import innitData from "./config/seed";
import passport from "passport";
import { configPassportLocal } from "./middleware/passport-local";
import session from "express-session";
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

// config views engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static file
app.use(express.static("public"));

// config session and passport
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
configPassportLocal();
// config passport
app.use(passport.initialize());
configPassportLocal();

// config routes
webRoutes(app);
// config global
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// seeding data
getConnect();
innitData();

dotenv.config();

app.use(methodOverride("_method"));

app.use((req, res) => {
  const path = req.originalUrl;
  if (
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/admin")
  ) {
    return res.status(403).render("admin/status/403");
  }
  res.status(404).render("admin/status/404");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
