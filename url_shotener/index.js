// import express, { urlencoded } from "express";
// import path from 'path';
// // const urlRoutes = require('./routes/url.routes.js')
// import urlRoutes from './routes/url.routes.js'
// import userRoutes from './routes/user.auth.routes.js'
// import connectDB from "./db/index.db.js";
// // import { URL } from "./model/url.model.js";
// import  staticRouter  from "./routes/staticRouter.js"
// // const e = require('express');

// const app = express();
// const PORT = 8001;

// // connectDB("mongodb://127.0.0.1:27017/url-short")
// connectDB()


// app.set("view engine","ejs");
// app.set('views',path.resolve('./views'));

// app.use(express.json());
// app.use(express.urlencoded({ extended : false}))
// app.use('/',staticRouter);

// app.use("/url",urlRoutes);
// app.use("/user",userRoutes);

// app.listen(PORT,()=>console.log(`server started at ${PORT}`))


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/index.db.js';
import urlRoutes from './routes/url.routes.js';
import userRoutes from './routes/user.auth.routes.js';
import staticRouter from './routes/staticRouter.js';

// Load env vars
dotenv.config({ path: './.env' });

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
await connectDB();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Routes
app.use('/', staticRouter);
app.use('/url', urlRoutes);
app.use('/user', userRoutes);

// Error handling middleware (add your custom error handler if needed)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});