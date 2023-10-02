import express from 'express';

const PORT = 3500;
const app = express();

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

app.get("/",(req,res)=>{
    res.send({message: "hello"})
})