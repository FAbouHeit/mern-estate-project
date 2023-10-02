import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB!")
}).catch((err)=>{
    console.error('Error connecting to mongoDB', err);  
})

const PORT = 3504;
const app = express();

try{
app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`)
    })
} catch { 
    console.error('Error starting server')
}

app.get("/",(req,res)=>{
    res.send({message: "helddlo"})
})