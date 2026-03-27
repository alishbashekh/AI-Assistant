import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js'
import errorhandle from './middleware/errorhandle.js'

import AuthRoutes from './Routes/AuthRoutes.js'
import documentRoute from './Routes/documentRoute.js'
import flashcardRoutes from './Routes/flashcardRoutes.js'
import aiRoutes from './Routes/aiRoutes.js'
import quizRoutes from './Routes/quizRoutes.js'
import progressRoute from './Routes/progressRoute.js'



const __filname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filname);

const app = express();

connectDB();

// middleware to handle cors 
app.use(
    cors({
        origin: "*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders: ["Content-Type","Authorization"],
        credentials:true,
    })
)

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//statics folders for uploads 
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

//ROUTES

app.use('/api/auth',AuthRoutes)
app.use('/api/documents', documentRoute)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/progress', progressRoute)


app.use(errorhandle);
//ERROR HANDLER
app.use((req,res)=>{
    res.status(404).json({
        success:false,
        error:'Route not found',
        statuscode:404,
    });
});

//start server
const PORT = process.env.PORT || 8000;
app.listen(PORT , ()=>{
    console.log(`server is runing in ${process.env.NODE_ENV} mode on port ${PORT}`);    
});

process.on('unhandledRejection',(err)=>{
  console.error(`ERROR :${err.message}`);
  process.exit(1);
});

