const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Импортируем библиотеку fs
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const app = express('mongoose');
require('dotenv').config()
const port = process.env.PORT;
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')

app.use(cors({
  origin: 'http://localhost:4000',
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
 }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try{
    await mongoose.connect(process.env.DB_URL)
    app.listen( port, () => console.log(`Сервер запущен на ${port}`))
  }catch(e){
    console.log(e)
  }
}

start();
